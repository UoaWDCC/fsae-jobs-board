import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';

export interface OwnerOnlyOptions {
  /** index of the ID arg (default = 0) */
  idIndex?: number;
  /** model field to compare against userId */
  ownerField: string;
  /** zero-arg function that returns the repo */
  repoGetter?: () => any;   
}

export function ownerOnly(options: OwnerOnlyOptions) {
  const {idIndex = 0, ownerField, repoGetter} = options;
  return function (_t: any, _m: string, desc: PropertyDescriptor) {
    const original = desc.value!;
    desc.value = async function (...args: any[]) {

      const resourceId = args[idIndex];
      if (!resourceId) throw new HttpErrors.BadRequest('Missing resource ID');

      const user = (this as any).currentUserProfile as UserProfile;
      const userId = user?.id?.toString();
      if (!userId) throw new HttpErrors.Unauthorized();

      let ownerValue: string;
      if (!repoGetter) {
        ownerValue = resourceId.toString();
      } else {
        const repo = repoGetter();
        const resource = await repo.findById(resourceId);
        ownerValue = resource?.[ownerField]?.toString();
      }

      if (ownerValue !== userId) {
        throw new HttpErrors.Forbidden('Not the resource owner');
      }
      return original.apply(this, args);
    };
    return desc;
  };
}
