import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DevInMemDataSource} from '../datasources';
import {Application, ApplicationRelations, Member} from '../models';
import {MemberRepository} from './member.repository';

export class ApplicationRepository extends DefaultCrudRepository<
  Application,
  typeof Application.prototype.applicationID,
  ApplicationRelations
> {

  public readonly submits: BelongsToAccessor<Member, typeof Application.prototype.applicationID>;

  constructor(
    @inject('datasources.devInMem') dataSource: DevInMemDataSource, @repository.getter('MemberRepository') protected memberRepositoryGetter: Getter<MemberRepository>,
  ) {
    super(Application, dataSource);
    this.submits = this.createBelongsToAccessorFor('submits', memberRepositoryGetter,);
  }
}
