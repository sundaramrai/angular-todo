// src/app/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { of, map, delay } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      // similar to username do for email
      email: ['', [Validators.required, this.localEmailValidator], [this.existingEmailValidator()]],
      username: [
        '',
        [Validators.required, this.localUsernameValidator],
        [this.existingUsernameValidator()]
      ],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      phoneNumbers: this.fb.array([this.createPhoneNumber()]),
      // addresses: this.fb.array([this.createAddress()]),
    });
  }

  ngOnInit() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      this.router.navigate(['/todo']);
    }
    // Log all registered users stored in local storage
    const registeredUsers = JSON.parse(localStorage.getItem('registerData') || '[]');
    console.log('Registered Users:', registeredUsers);
  }

  get phoneNumbers(): FormArray {
    return this.registerForm.get('phoneNumbers') as FormArray;
  }

  // get addresses(): FormArray {
  //   return this.registerForm.get('addresses') as FormArray;
  // }

  createPhoneNumber(): FormGroup {
    return this.fb.group({
      number: ['', [Validators.required, this.phoneNumberValidator]],
    });
  }

  // createAddress(): FormGroup {
  //   return this.fb.group({
  //     address: ['', [Validators.required, this.addressValidator]],
  //   });
  // }

  addPhoneNumber() {
    this.phoneNumbers.push(this.createPhoneNumber());
  }

  removePhoneNumber(index: number) {
    this.phoneNumbers.removeAt(index);
  }

  // addAddress() {
  //   this.addresses.push(this.createAddress());
  // }

  // removeAddress(index: number) {
  //   this.addresses.removeAt(index);
  // }

  // Existing synchronous validation for username
  localUsernameValidator(control: AbstractControl): ValidationErrors | null {
    const username = control.value;

    if (!username) return null;

    const isNumeric = /^\d+$/.test(username);
    if (isNumeric) return { invalidUsername: true };

    const alphabeticCount = (username.match(/[a-zA-Z]/g) || []).length;
    if (alphabeticCount < 3) return { invalidUsername: true };

    if (username === '_') return { invalidUsername: true };

    const hasInvalidChars = /[^a-zA-Z0-9_]/.test(username);
    if (hasInvalidChars) return { invalidUsername: true };

    return null;
  }

  // New async validator to check if username exists
  existingUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const username = control.value;

      // Simulate an API call to check username (using local storage here)
      return of(localStorage.getItem('registerData'))
        .pipe(
          delay(500), // Simulate network latency
          map((data) => {
            const registeredUsers = JSON.parse(data || '[]');
            const exists = registeredUsers.some((user: any) => user.username === username);

            return exists ? { usernameExists: true } : null;
          })
        );
    };
  }

  onUsernameInput(event: any) {
    const input = event.target;
    input.value = input.value.toLowerCase();
  }

  passwordValidator(control: any) {
    const password = control.value;

    if (!password) {
      return null;
    }

    const numberCount = (password.match(/\d/g) || []).length;
    const upperCaseCount = (password.match(/[A-Z]/g) || []).length;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    const valid = numberCount >= 2 && upperCaseCount >= 2 && hasSpecialChar && hasLowerCase;

    if (!valid) {
      return { invalidPassword: true };
    }
    return null;
  }

  confirmPasswordValidator() {
    return (control: any) => {
      if (control.value !== this.registerForm.get('password')?.value) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  phoneNumberValidator(control: any) {
    const phoneNumber = control.value;
    const valid = /^[6-9]\d{9}$/.test(phoneNumber);

    if (!valid) {
      return { invalidPhoneNumber: true };
    }
    return null;
  }

  onPhoneNumberInput(event: any, index: number) {
    const input = event.target.value;
    const cleanedInput = input.replace(/[^0-9]/g, '');
    this.phoneNumbers.at(index).get('number')?.setValue(cleanedInput);
  }

  // addressValidator(control: any) {
  //   const address = control.value;

  //   if (address && address.trim().length > 5 && /^[a-zA-Z0-9\s,.'-]*$/.test(address)) {
  //     return null;
  //   }

  //   return { invalidAddress: true };
  // }

  // emailValidator(control: any) {
  //   const email = control.value;
  //   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //   if (!emailPattern.test(email)) {
  //     return { invalidEmailFormat: true };
  //   }

  //   const [local, domain] = email.split('@');

  //   if (domain && domain.indexOf('.') !== -1) {
  //     return null;
  //   }

  //   return { invalidEmailDomain: true };
  // }

  localEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;

    if (!email) return null;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) return { invalidEmailFormat: true };

    const [local, domain] = email.split('@');

    if (domain && domain.indexOf('.') !== -1) return null;

    return { invalidEmailDomain: true };
  }

  existingEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const email = control.value;

      return of(localStorage.getItem('registerData'))
        .pipe(
          delay(500), // Simulate network latency
          map((data) => {
            const registeredUsers = JSON.parse(data || '[]');
            const exists = registeredUsers.some((user: any) => user.email === email);

            return exists ? { emailExists: true } : null;
          })
        );
    };
  }

  onRegister() {
    if (this.registerForm.invalid) {
      return;
    }
    // Check if username already exists
    const username = this.registerForm.get('username')?.value;
    const registeredUsers = JSON.parse(localStorage.getItem('registerData') || '[]');
    const existingUser = registeredUsers.find((user: any) => user.username === username);
    if (existingUser) {
      alert('Username already exists. Please choose a different username.');
      return;
    }

    let existingData = JSON.parse(localStorage.getItem('registerData') || '[]');

    if (!Array.isArray(existingData)) {
      console.error('Data in localStorage is not an array. Initializing as empty array.');
      existingData = [];
    }

    const newUser = this.registerForm.value;
    existingData.push(newUser);

    localStorage.setItem('registerData', JSON.stringify(existingData));

    this.registerForm.reset();
    this.phoneNumbers.clear();
    // this.addresses.clear();
    this.phoneNumbers.push(this.createPhoneNumber());
    // this.addresses.push(this.createAddress());
    this.router.navigate(['/']);
    console.log('New User registered:', newUser);
  }

  onLogin() {
    this.router.navigate(['/']);
  }
}
