import { CanActivateFn, Router } from "@angular/router";
import { inject} from "@angular/core";

export const roleGuard = (expectedRole: string): CanActivateFn =>{
    return ()=>{
        const router = inject(Router);
        const role = localStorage.getItem('role');
        if(role === expectedRole) return true;
        router.navigate(['/login']);
        return false
    };
};