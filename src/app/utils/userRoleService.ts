import users from '@/data/users.json';
import providers from '@/data/providers.json';
import clients from '@/data/clients.json';
import admins from '@/data/admins.json';

export interface User {
  user_id: number;
  provider_id?: number;
  client_id?: number;
  admin_id?: number;
  email: string;
  password: string;
  role: 'provider' | 'client' | 'admin';
  is_active: boolean;
  created_at: string;
  last_login: string;
}

export interface UserWithDetails extends User {
  provider?: {
    firstName: string;
    lastName: string;
    slug: string;
    avatar: string;
    role: string;
    location: string;
    languages: string[];
  };
  client?: {
    firstName: string;
    lastName: string;
    slug: string;
    avatar: string;
    company: string;
    position: string;
    location: string;
    languages: string[];
  };
  admin?: {
    firstName: string;
    lastName: string;
    slug: string;
    avatar: string;
    role: string;
    permissions: string[];
    location: string;
    languages: string[];
  };
}

export class UserRoleService {
  /**
   * Vérifie si un utilisateur est un prestataire
   */
  static isProvider(userId: number): boolean {
    const user = users.find(u => u.user_id === userId);
    return user?.role === 'provider';
  }

  /**
   * Vérifie si un utilisateur est un client
   */
  static isClient(userId: number): boolean {
    const user = users.find(u => u.user_id === userId);
    return user?.role === 'client';
  }

  /**
   * Vérifie si un utilisateur est un administrateur
   */
  static isAdmin(userId: number): boolean {
    const user = users.find(u => u.user_id === userId);
    return user?.role === 'admin';
  }

  /**
   * Vérifie si un utilisateur a un rôle spécifique
   */
  static hasRole(userId: number, role: 'provider' | 'client' | 'admin'): boolean {
    const user = users.find(u => u.user_id === userId);
    return user?.role === role;
  }

  /**
   * Récupère les détails complets d'un utilisateur avec ses informations spécifiques
   */
  static getUserWithDetails(userId: number): UserWithDetails | null {
    const user = users.find(u => u.user_id === userId);
    
    if (!user) {
      return null;
    }

    let userWithDetails: UserWithDetails = { ...user };

    switch (user.role) {
      case 'provider':
        if (user.provider_id) {
          const provider = providers.find(p => p.provider_id === user.provider_id);
          if (provider) {
            userWithDetails.provider = {
              firstName: provider.firstName,
              lastName: provider.lastName,
              slug: provider.slug,
              avatar: provider.avatar,
              role: provider.role,
              location: provider.location,
              languages: provider.languages,
            };
          }
        }
        break;

      case 'client':
        if (user.client_id) {
          const client = clients.find(c => c.client_id === user.client_id);
          if (client) {
            userWithDetails.client = {
              firstName: client.firstName,
              lastName: client.lastName,
              slug: client.slug,
              avatar: client.avatar,
              company: client.company,
              position: client.position,
              location: client.location,
              languages: client.languages,
            };
          }
        }
        break;

      case 'admin':
        if (user.admin_id) {
          const admin = admins.find(a => a.admin_id === user.admin_id);
          if (admin) {
            userWithDetails.admin = {
              firstName: admin.firstName,
              lastName: admin.lastName,
              slug: admin.slug,
              avatar: admin.avatar,
              role: admin.role,
              permissions: admin.permissions,
              location: admin.location,
              languages: admin.languages,
            };
          }
        }
        break;
    }

    return userWithDetails;
  }

  /**
   * Récupère tous les utilisateurs d'un rôle spécifique
   */
  static getUsersByRole(role: 'provider' | 'client' | 'admin'): User[] {
    return users.filter(user => user.role === role);
  }

  /**
   * Récupère tous les prestataires avec leurs détails
   */
  static getAllProviders(): UserWithDetails[] {
    return users
      .filter(user => user.role === 'provider')
      .map(user => this.getUserWithDetails(user.user_id)!)
      .filter(Boolean);
  }

  /**
   * Récupère tous les clients avec leurs détails
   */
  static getAllClients(): UserWithDetails[] {
    return users
      .filter(user => user.role === 'client')
      .map(user => this.getUserWithDetails(user.user_id)!)
      .filter(Boolean);
  }

  /**
   * Récupère tous les administrateurs avec leurs détails
   */
  static getAllAdmins(): UserWithDetails[] {
    return users
      .filter(user => user.role === 'admin')
      .map(user => this.getUserWithDetails(user.user_id)!)
      .filter(Boolean);
  }

  /**
   * Vérifie les identifiants d'un utilisateur
   */
  static validateCredentials(email: string, password: string): User | null {
    const user = users.find(u => u.email === email);
    
    if (!user || !user.is_active) {
      return null;
    }

    if (user.password === password) {
      return user;
    }

    return null;
  }

  /**
   * Récupère un utilisateur par son email
   */
  static getUserByEmail(email: string): User | null {
    const user = users.find(u => u.email === email);
    return user || null;
  }

  /**
   * Récupère un utilisateur par son ID
   */
  static getUserById(userId: number): User | null {
    const user = users.find(u => u.user_id === userId);
    return user || null;
  }
}
