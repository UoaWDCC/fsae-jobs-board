import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import { FsaeRole } from '../models';

export interface OwnerOnlyOptions {
  idIndex?: number;
  ownerField: string;
  repoKey?: string;
}

export function ownerOnly(options: OwnerOnlyOptions) {
  const {idIndex = 0, ownerField, repoKey} = options;

  return function (_t: any, _m: string, desc: PropertyDescriptor) {
    const original = desc.value!;
    desc.value = async function (...args: any[]) {
      const resourceId = args[idIndex];
      if (!resourceId) throw new HttpErrors.BadRequest('Missing resource ID');

      const user = (this as any).currentUserProfile as UserProfile;
      console.log('OWNER_ONLY: User profile:', user);
      console.log('OWNER_ONLY: Resource ID:', resourceId);
      const userId = user?.id?.toString();
      if (!userId) throw new HttpErrors.Unauthorized("UserID not found in user profile");
      console.log('OWNER_ONLY: User ID:', userId);

      if (user.role === FsaeRole.ADMIN) {
        return original.apply(this, args);
      }

      if (!repoKey) {
        if (resourceId !== userId) {
          throw new HttpErrors.Forbidden('Not the resource owner');
        }
        return original.apply(this, args);
      }

      const repo = (this as any)[repoKey];
      if (!repo?.findById) throw new HttpErrors.InternalServerError(`Repository '${repoKey}' not found`);

      const resource = await repo.findById(resourceId);
      console.log('OWNER_ONLY: Found resource:', resource);
      const ownerValue = resource?.[ownerField]?.toString();
      console.log('OWNER_ONLY: Owner field value:', ownerValue);
      console.log('OWNER_ONLY: Comparing ownerValue:', ownerValue, 'with userId:', userId);

      if (ownerValue !== userId) {
        console.log('OWNER_ONLY: Access denied - not the resource owner');
        throw new HttpErrors.Forbidden('Not the resource owner');
      }
      
      console.log('OWNER_ONLY: Access granted - user is the resource owner');

      return original.apply(this, args);
    };
    return desc;
  };
}
