import { Injectable } from '@angular/core';

export interface IMenu {
  title: string;
  url: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private adminMenu: IMenu[] = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Usuario', url: '/usuarios', icon: 'person' },
    { title: 'Seguros', url: '/seguros', icon: 'security' },
    { title: 'Contratos', url: '/contratos', icon: 'description' },
    { title: 'Clientes', url: '/clientes', icon: 'people' },
    { title: 'Reembolsos', url: '/reembolsos/pendientes', icon: 'receipt' },
  ];

  private clienteMenu: IMenu[] = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Mis Contratos', url: '/mis-contratos', icon: 'assignment' },
    {
      title: 'Pedir Reembolso',
      url: '/reembolsos/crear',
      icon: 'request_quote',
    },
    { title: 'Mis Reembolsos', url: '/reembolsos', icon: 'receipt_long' },
  ];

  getMenuByRol(rol: string): IMenu[] {
    switch (rol.toUpperCase()) {
      case 'ADMIN':
      case 'AGENTE':
        return [...this.adminMenu];
      case 'CLIENTE':
        return [...this.clienteMenu];
      default:
        return [{ title: 'Inicio', url: '/home', icon: 'home' }];
    }
  }
  getMenu(): IMenu[] {
  // Por defecto asumimos ADMIN para los tests
  return this.getMenuByRol('ADMIN');
}

getMenuByUrl(url: string): IMenu | undefined {
  const normalizedUrl = url.toLowerCase();
  const allMenus = [...this.adminMenu, ...this.clienteMenu];
  return allMenus.find((item) => item.url.toLowerCase() === normalizedUrl);
}

}
