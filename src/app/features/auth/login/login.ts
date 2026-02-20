import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  errorMessage = '';
  isLoading=false;
  loginForm!: any;
  submitted = false;

  constructor(
    private fb:FormBuilder,
    private authService: AuthService,
    private router: Router
  )
  {
    this.loginForm = this.fb.group({
    email:['',[Validators.email, Validators.required]],
    password:['',[Validators.required]]
  });}

  
  onSubmit() {

    this.submitted = true;// when the user click submit then only error will be shown

    if(this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage='';

    this.authService.login(this.loginForm.value).pipe(
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: (res) => {
        this.authService.saveAuthData(res);
        console.log('Login Success:', res);

        this.redirectByRole(res.role);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

  redirectByRole(role: string) {

    if (role === 'Admin') {
      this.router.navigate(['/dashboard/admin']);
    }
    else if (role === 'Owner') {
      this.router.navigate(['/dashboard/owner']);
    }
    else {
      this.router.navigate(['/dashboard/user']);
    }
  }
}