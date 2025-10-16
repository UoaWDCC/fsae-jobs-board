import {inject, lifeCycleObserver, LifeCycleObserver, Application, CoreBindings} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AdminRepository} from '../repositories';
import {Admin, FsaeRole} from '../models';
import { AdminStatus } from '../models/admin.status';
import { PasswordHasherService } from '../services/password-hasher.service';

@lifeCycleObserver('startup') // group name is arbitrary, helps ordering if needed
export class StartupObserver implements LifeCycleObserver {
  constructor(
    @repository(AdminRepository) private admins: AdminRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
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

        const hashedPassword = await passwordHasherService.hashPassword(String(process.env.DEFAULT_ADMIN_PASSWORD));

        await this.admins.create({
          email: String(process.env.DEFAULT_ADMIN_EMAIL),
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

        console.info(`Default admin created. Email: ${process.env.DEFAULT_ADMIN_EMAIL} Password: ${process.env.DEFAULT_ADMIN_PASSWORD}`);
      } catch (err) {
        console.error('Failed to create default admin account', err);
      }
    }
  }

  async stop(): Promise<void> {}
}
