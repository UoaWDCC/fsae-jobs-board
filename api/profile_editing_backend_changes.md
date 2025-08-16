# Backend Changes Documentation - Compulsory profile editing #103

## Summary

Implemented profile completion detection that redirects users with missing required fields after login. Made critical fixes to model inheritance (Alumni/Sponsor field updates now work) and registration activation (Alumni/Sponsor can now login). Added temporary dual role field workaround for JWT compatibility. Feature uses existing PATCH endpoints and adds `hasMissingInfo` flag to login responses.

---

## Critical Changes by File

| File | Change | Type | Impact |
|------|--------|------|---------|
| `login.controller.ts` | Added `hasMissingInfo` detection logic with role-based field validation | **PERMANENT** *(unless required info changes)* | Core feature functionality - preserve completely |
| `register.controller.ts` | Set both `role` and `fsaeRole` fields, changed Alumni/Sponsor `activated: false` → `true`, added company field | **MIXED** | Dual role = temporary, activation + company = permanent|
| `fsae-user.model.ts` | Removed role default value (`FsaeRole.UNKNOWN`), added firstName/lastName defaults | **PERMANENT** | Fixes role field behaviour, enables profile detection |
| `alumni.model.ts` | **Completely removed** all local property definitions (firstName, lastName, subGroup, company) | **CRITICAL** | Field updates will break if reverted |
| `sponsor.model.ts` | **Completely removed** all local property definitions (name, websiteURL, industry, tier) | **CRITICAL** | Field updates will break if reverted |
| `member.model.ts` | Fixed buffer type (`format: 'binary'`), removed duplicate properties | **PERMANENT** | Schema compliance + inheritance fix |
| `register.controller.types.ts` | Added `company?: string` to createFSAEUserDto | **PERMANENT** | Alumni/Sponsor registration support |

---

## Required Fields by Role

| Role | Required Fields |
|------|----------------|
| **Member** | `firstName`, `lastName`, `phoneNumber` |
| **Alumni** | `firstName`, `lastName`, `phoneNumber`, `company` |
| **Sponsor** | `company`, `name`, `phoneNumber` |
| **Admin** | None (bypassed) |

---

## Integration Notes for Backend Restructuring

### CRITICAL - Change with caution:
- **Model inheritance fixes** (`alumni.model.ts`, `sponsor.model.ts`) - Removing duplicate properties was essential for field persistence
- **Registration activation** - Alumni/Sponsor `activated: true` prevents JWT verification failures
- **Profile completion logic** - `hasMissingInfo` detection in login controller is core functionality

### TEMPORARY - Can modify:
- **Dual role fields** - Once JWT service uses `role` instead of `fsaeRole`, simplify to single field
- **Default values** - firstName/lastName defaults can be adjusted per your design

### JWT SERVICE UPDATE REQUIRED:
- Currently expects `fsaeRole` field - update to use `role` field during your refactoring
- Ensure no duplicate `@property` decorators are re-introduced in derived models

---

## API Contract Changes

**Login Response** (new field added):
```typescript
{
  userId: string;
  token: string;
  verified: boolean;
  hasMissingInfo: boolean; // NEW - triggers profile completion flow
}
```

**Existing Endpoints Used:**
- PATCH `/user/member/{id}`
- PATCH `/user/alumni/{id}`  
- PATCH `/user/sponsor/{id}`

---

## Quick Verification Tests

1. **Registration**: Verify new users have both `role` and `fsaeRole` fields with `activated: true`
2. **Login Response**: Check `hasMissingInfo` field appears in login API responses
3. **Profile Detection**: Remove required field in database, verify `hasMissingInfo: true` on next login
4. **Field Updates**: Test Alumni/Sponsor profile field edits persist to database

**Database Test:**
```javascript
// Remove required fields to test detection
db.members.updateOne({email: "test@test.com"}, {$set: {firstName: "", phoneNumber: ""}})
// Next login should return hasMissingInfo: true
```

---

## Summary

Profile completion feature is fully functional. Users with incomplete profiles are redirected after login and can edit fields inline. Critical model inheritance fixes enable field persistence for all roles. Temporary dual role workaround can be cleaned up when JWT service is updated to use only `role` field.