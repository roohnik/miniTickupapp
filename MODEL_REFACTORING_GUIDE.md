# Model Refactoring Guide - Tickappback

## Quick Reference Guide

This is a condensed, actionable guide for refactoring the Tickappback model associations. For detailed analysis, see [MODEL_ASSOCIATIONS_ANALYSIS.md](./MODEL_ASSOCIATIONS_ANALYSIS.md).

---

## 🔴 Critical Fixes (DO IMMEDIATELY)

### Issue 1: KeyResult → Comment Association Crash

**File**: `models/keyResult.js` (lines 72-75)

**Current Code**:
```javascript
KeyResult.hasMany(models.Comment, {
  foreignKey: "kr_id",
  as: "comments",
}); // NEW
```

**Fix** (Choose One):

#### Option A: Quick Fix (Comment Out)
```javascript
KeyResult.associate = (models) => {
  KeyResult.belongsTo(models.Objective, {
    foreignKey: "objective_id",
    as: "objective",
  });
  KeyResult.belongsTo(models.User, { foreignKey: "owner_id", as: "owner" });
  KeyResult.hasMany(models.KRCheckin, {
    foreignKey: "kr_id",
    as: "checkIns",
  });
  // TODO: Implement Comment model properly before uncommenting
  // See: backend-models/comment.js template
  // KeyResult.hasMany(models.Comment, {
  //   foreignKey: "kr_id",
  //   as: "comments",
  // });
};
```

#### Option B: Complete Implementation
1. Copy `backend-models/comment.js` to `models/comment.js`
2. Create migration: `migrations/YYYYMMDDHHMMSS-create-kr-comments.js`
3. Run: `npx sequelize-cli db:migrate`
4. Keep the association in keyResult.js

---

### Issue 2: Process → Variable Association Crash

**File**: `models/process.js` (lines 46-49)

**Current Code**:
```javascript
Process.hasMany(models.Variable, {
  foreignKey: "process_id",
  as: "variables",
});
```

**Fix**:
```javascript
Process.associate = (models) => {
  // Variables are stored in variableIds array field
  // TODO: Create Variable model if relational approach is preferred
  // Process.hasMany(models.Variable, {
  //   foreignKey: "process_id",
  //   as: "variables",
  // });

  Process.belongsTo(models.User, {
    foreignKey: "owner_id",
    as: "owner",
  });

  // Note: strategy_id field needs to be added to model definition
  // before this association will work
  Process.belongsTo(models.Strategy, {
    foreignKey: "strategy_id",
    as: "strategy",
  });
};
```

**Also Add**: Missing `strategy_id` foreign key to model definition:
```javascript
const Process = sequelize.define("Process", {
  // ... existing fields
  strategy_id: {
    type: DataTypes.TEXT,
    allowNull: true,
    references: { model: "strategies", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  // ... rest of fields
});
```

---

## 🟡 High Priority Fixes

### Issue 3: User-Team Relationship Conflict

**Files**: `models/user.js`, `models/team.js`

**Problem**: Conflicting patterns - direct belongsTo AND many-to-many

**Current Code**:
```javascript
// User has BOTH:
User.belongsTo(models.Team, { foreignKey: "teamId", as: "team" });
User.belongsToMany(models.Team, {
  through: models.TeamMember,
  foreignKey: "user_id",
  otherKey: "team_id",
  as: "teams",
});
```

**Recommended Fix** (Primary Team + Memberships):
```javascript
// In user.js
User.associate = (models) => {
  // Primary team assignment
  User.belongsTo(models.Team, { 
    foreignKey: "teamId", 
    as: "primaryTeam" 
  });
  
  // Additional team memberships
  User.belongsToMany(models.Team, {
    through: models.TeamMember,
    foreignKey: "user_id",
    otherKey: "team_id",
    as: "memberTeams",
  });
  
  // ... other associations
};
```

**Alternative** (Remove teamId, use only many-to-many):
```javascript
// Remove teamId column from users table via migration
// Then in user.js:
User.belongsToMany(models.Team, {
  through: models.TeamMember,
  foreignKey: "user_id",
  otherKey: "team_id",
  as: "teams",
});
```

---

### Issue 4: Missing Strategy Reverse Associations

**File**: `models/strategy.js`

**Current Code**:
```javascript
Strategy.associate = (models) => {
  Strategy.hasMany(models.Index, { foreignKey: "strategy_id" });
};
```

**Fix** (Add missing associations):
```javascript
Strategy.associate = (models) => {
  Strategy.hasMany(models.Index, { 
    foreignKey: "strategy_id",
    as: "indices"
  });
  
  // Add reverse associations for models that reference Strategy
  Strategy.hasMany(models.Objective, { 
    foreignKey: "strategy_id",
    as: "objectives"
  });
  
  Strategy.hasMany(models.Process, { 
    foreignKey: "strategy_id",
    as: "processes"
  });
};
```

---

## 🟢 Medium Priority Improvements

### Issue 5: Task Subtask Hierarchy

**File**: `models/task.js`

**Problem**: `parent_id` field exists but no association defined

**Add to Task.associate**:
```javascript
Task.associate = (models) => {
  // ... existing associations
  
  // Add subtask support
  Task.belongsTo(models.Task, { 
    foreignKey: "parent_id", 
    as: "parent" 
  });
  
  Task.hasMany(models.Task, { 
    foreignKey: "parent_id", 
    as: "subtasks" 
  });
};
```

---

### Issue 6: KRCheckin Missing Associations

**File**: `models/krCheckin.js`

**Add complete associations**:
```javascript
KRCheckin.associate = (models) => {
  KRCheckin.belongsTo(models.KeyResult, { 
    foreignKey: 'kr_id', 
    as: 'keyResult' 
  });
  
  KRCheckin.belongsTo(models.User, { 
    foreignKey: 'user_id', 
    as: 'user' 
  });
  
  KRCheckin.belongsTo(models.User, { 
    foreignKey: 'feedback_giver_id', 
    as: 'feedbackGiver' 
  });
  
  KRCheckin.belongsTo(models.FeedbackTag, { 
    foreignKey: 'feedback_tag_id', 
    as: 'feedbackTag' 
  });
};
```

---

## 📋 Checklist for Implementation

### Phase 1: Critical (Do First) ✅
- [ ] Comment out KeyResult → Comment association
- [ ] Comment out Process → Variable association
- [ ] Add Process.strategy_id field to model
- [ ] Test server startup (should succeed)
- [ ] Commit changes

### Phase 2: High Priority ✅
- [ ] Decide on User-Team relationship pattern
- [ ] Update User associations (rename aliases)
- [ ] Add Strategy reverse associations
- [ ] Add tests for all associations
- [ ] Commit changes

### Phase 3: Medium Priority ✅
- [ ] Add Task subtask associations
- [ ] Complete KRCheckin associations
- [ ] Test eager loading with includes
- [ ] Commit changes

### Phase 4: Optional Enhancements ✅
- [ ] Implement Comment model (if needed)
- [ ] Implement Variable model (if needed)
- [ ] Consider replacing array FKs with junction tables
- [ ] Standardize naming conventions
- [ ] Add JSDoc comments

---

## Testing After Changes

### 1. Test Model Loading
```javascript
// Create test-models.js
require("dotenv").config();
const { models } = require("./models/index.js");

console.log("✅ Models loaded successfully!");
console.log("Available models:", Object.keys(models));

// Test a few associations
console.log("KeyResult associations:", Object.keys(models.KeyResult.associations));
console.log("User associations:", Object.keys(models.User.associations));
console.log("Process associations:", Object.keys(models.Process.associations));
```

### 2. Test Association Queries
```javascript
// Test eager loading
const keyResult = await models.KeyResult.findOne({
  include: [
    { model: models.Objective, as: 'objective' },
    { model: models.User, as: 'owner' },
    { model: models.KRCheckin, as: 'checkIns' }
  ]
});

const user = await models.User.findOne({
  include: [
    { model: models.Team, as: 'primaryTeam' },
    { model: models.Objective, as: 'objectives' }
  ]
});
```

### 3. Test Cascade Deletes
```javascript
// Create test records
const user = await models.User.create({ /* ... */ });
const objective = await models.Objective.create({ owner_id: user.id });
const kr = await models.KeyResult.create({ objective_id: objective.id });

// Delete parent
await objective.destroy();

// Verify child handling (should be SET NULL or CASCADE depending on config)
const orphanedKr = await models.KeyResult.findByPk(kr.id);
console.log("KR after objective delete:", orphanedKr.objective_id); // Should be null
```

---

## Common Pitfalls to Avoid

### ❌ Don't Do This:
```javascript
// Missing 'as' alias
Model.belongsTo(models.Other, { foreignKey: 'other_id' });
// Include will fail without alias
```

### ✅ Do This:
```javascript
// Always specify 'as' for clarity
Model.belongsTo(models.Other, { foreignKey: 'other_id', as: 'other' });
// Can now: include: [{ model: models.Other, as: 'other' }]
```

### ❌ Don't Do This:
```javascript
// Missing foreign key in model definition
Model.belongsTo(models.Other, { foreignKey: 'other_id', as: 'other' });
// But 'other_id' not in model schema
```

### ✅ Do This:
```javascript
// Define FK in model first
const Model = sequelize.define('Model', {
  other_id: {
    type: DataTypes.TEXT,
    references: { model: 'others', key: 'id' }
  }
});
```

### ❌ Don't Do This:
```javascript
// Inconsistent alias naming
Model1.hasMany(models.Model2, { as: 'model_twos' });
Model3.hasMany(models.Model2, { as: 'Model2s' });
Model4.hasMany(models.Model2, { as: 'model2List' });
```

### ✅ Do This:
```javascript
// Consistent camelCase, pluralized
Model1.hasMany(models.Model2, { as: 'modelTwos' });
Model3.hasMany(models.Model2, { as: 'modelTwos' });
Model4.hasMany(models.Model2, { as: 'modelTwos' });
```

---

## Migration Templates

### For Comment Model (if implementing)

**File**: `migrations/YYYYMMDDHHMMSS-create-kr-comments.js`

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kr_comments', {
      id: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      kr_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: { model: 'key_results', key: 'id' },
        onDelete: 'CASCADE',
      },
      author_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('kr_comments', ['kr_id']);
    await queryInterface.addIndex('kr_comments', ['author_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kr_comments');
  },
};
```

### For Process.strategy_id Field

**File**: `migrations/YYYYMMDDHHMMSS-add-strategy-id-to-processes.js`

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('processes', 'strategy_id', {
      type: Sequelize.TEXT,
      allowNull: true,
      references: { model: 'strategies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    
    await queryInterface.addIndex('processes', ['strategy_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('processes', 'strategy_id');
  },
};
```

---

## Quick Wins (Easy Improvements)

1. **Add 'as' aliases where missing** - Makes queries clearer
2. **Standardize plural/singular** - Use singular for belongsTo, plural for hasMany
3. **Add indexes on foreign keys** - Already done in most cases ✅
4. **Use consistent onDelete rules** - CASCADE for children, SET NULL for optional

---

## Questions to Answer

Before implementing fixes, clarify these business requirements:

1. **User-Team Relationship**:
   - Can a user belong to multiple teams?
   - Is there a concept of "primary team"?
   - What happens when team is deleted?

2. **KeyResult Comments**:
   - Is comment functionality needed?
   - Should comments cascade delete with KeyResult?
   - Who can comment (any user, or only owners)?

3. **Process Variables**:
   - Are variables needed as separate entities?
   - Or is array storage sufficient?
   - Will variables be queried independently?

4. **Task Hierarchy**:
   - Do subtasks need to be supported?
   - How many levels deep?
   - Should progress roll up to parent?

---

## Support Files in This Repo

- `backend-models/comment.js` - Ready-to-use Comment model
- `backend-models/migration-create-kr-comments.js` - Comment table migration
- `backend-fix.patch` - Quick fix patch file
- `BACKEND_FIX.md` - Detailed fix documentation
- `MODEL_ASSOCIATIONS_ANALYSIS.md` - Complete analysis

---

## Summary

**Total Issues Found**: 6 critical/high priority
**Time to Fix Critical**: ~15 minutes
**Time to Fix All High Priority**: ~2 hours
**Recommended Approach**: Fix critical first, then tackle high priority incrementally

**Next Steps**:
1. Apply critical fixes (Phase 1)
2. Test server startup
3. Review User-Team requirement with team
4. Implement high priority fixes (Phase 2)
5. Add comprehensive tests

---

**Document Version**: 1.0
**Last Updated**: November 3, 2025
**Repository**: https://github.com/nikpz/Tickappback
