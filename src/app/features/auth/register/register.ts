import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,NgIf],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm!: FormGroup;
  errorMessage = "";
  baseUrl = "http://127.0.0.1:5000/users";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.http.post(`${this.baseUrl}/register`, this.registerForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || "Registration failed";
        }
      });
  }
}