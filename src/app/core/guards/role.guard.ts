import { CanActivateFn, Router } from "@angular/router";
import { inject} from "@angular/core";
import { AuthService } from "../services/auth.service";

export const roleGuard = (expectedRole: string): CanActivateFn =>{
    return ()=>{
        const router = inject(Router);
        const authService = inject(AuthService);

        console.log("Stored role:", authService.getRole());
        console.log("Expected role:", expectedRole);

        if(authService.getRole() === expectedRole) {
            
            return true;
        }
        router.navigate(['/login']);
        return false
    };
};