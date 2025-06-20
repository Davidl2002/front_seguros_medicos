import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data?.['roles'] as string[];

  return authService.getUser().pipe(
    take(1),
    map((user) => {
      const isLoggedIn = !!user;
      if (!isLoggedIn) {
        router.navigate(['/login']);
        return false;
      }

if (expectedRoles && !user.roles.some(role => expectedRoles.includes(role.toUpperCase()))) {
  router.navigate(['/unauthorized']);
  return false;
}
      return true;
    })
  );
};
