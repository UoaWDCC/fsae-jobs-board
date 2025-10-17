import {inject, lifeCycleObserver, LifeCycleObserver, Application, CoreBindings} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AdminRepository} from '../repositories';
import {Admin, FsaeRole} from '../models';
import { AdminStatus } from '../models/admin.status';
import { PasswordHasherService } from '../services/password-hasher.service';
import {MongoDbDataSource} from '../datasources';

@lifeCycleObserver('startup') // group name is arbitrary, helps ordering if needed
export class StartupObserver implements LifeCycleObserver {
  constructor(
    @repository(AdminRepository) private admins: AdminRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject('datasources.mongoDB') private dataSource: MongoDbDataSource,
  ) {}

  async start(): Promise<void> {
    // if admin repo is empty, create a new default admin account admin@admin.com password:admin
    const total = await this.admins.count();
    if (total.count === 0) {
      try {
        // Resolve the hasher by binding key to avoid ambiguous @service resolution
        const passwordHasherService = await this.app.get<PasswordHasherService>(
          'services.PasswordHasherService'
        );

        const hashedPassword = await passwordHasherService.hashPassword('admin');

        await this.admins.create({
          email: 'admin@admin.com',
          firstName: 'Default',
          lastName: 'Admin',
          phoneNumber: '0',
          password: hashedPassword,
          role: FsaeRole.ADMIN,
          adminStatus: AdminStatus.APPROVED,
          activated: true,
          verified: true,
          createdAt: new Date(),
        } as Partial<Admin>);

        console.info('Default admin created: admin@admin.com (password: admin)');
      } catch (err) {
        console.error('Failed to create default admin account', err);
      }
    }

    // Ensure TTL index on ApplicationNonce for automatic cleanup of expired nonces
    await this.ensureNonceTTLIndex();
  }

  /**
   * Ensures TTL index exists on ApplicationNonce.expiresAt for automatic cleanup.
   * Idempotent - safe to run on every startup.
   */
  private async ensureNonceTTLIndex(): Promise<void> {
    try {
      const connector = (this.dataSource as any).connector;
      const collection = connector.collection('ApplicationNonce');

      // TTL index: auto-delete at expiresAt timestamp, non-blocking creation
      await collection.createIndex(
        {expiresAt: 1},
        {expireAfterSeconds: 0, background: true}
      );

      console.info('TTL index ensured on ApplicationNonce.expiresAt');
    } catch (error) {
      // Non-fatal: nonces still work, just won't auto-delete
      console.error('Failed to create TTL index on ApplicationNonce:', error);
    }
  }

  async stop(): Promise<void> {}
}
