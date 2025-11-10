import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoundsService } from '../../services/rounds';

@Component({
  selector: 'app-add-round',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './add-round.html',
  styleUrls: ['./add-round.css']
})
export class AddRoundComponent {
  roundForm: FormGroup;
  teeColors = ['Black', 'Blue', 'White', 'Gold', 'Red'];
  weatherOptions = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Cold', 'Hot'];

  constructor(
    private fb: FormBuilder,
    private roundsService: RoundsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.roundForm = this.fb.group({
      date: [new Date(), Validators.required],
      courseName: ['', Validators.required],
      courseRating: [72, [Validators.required, Validators.min(50), Validators.max(90)]],
      slopeRating: [113, [Validators.required, Validators.min(55), Validators.max(155)]],
      score: ['', [Validators.required, Validators.min(40), Validators.max(150)]],
      numberOfHoles: [18, Validators.required],
      teeColor: ['White'],
      weather: [''],
      notes: ['']
    });

    // Add conditional validation based on number of holes
    this.roundForm.get('numberOfHoles')?.valueChanges.subscribe(holes => {
      const ratingControl = this.roundForm.get('courseRating');
      const scoreControl = this.roundForm.get('score');
      
      if (holes === 9) {
        // 9-hole validation
        ratingControl?.setValidators([Validators.required, Validators.min(25), Validators.max(45)]);
        scoreControl?.setValidators([Validators.required, Validators.min(18), Validators.max(80)]);
        // Reset to reasonable 9-hole defaults if current values are out of range
        if (ratingControl?.value > 45 || ratingControl?.value < 25) {
          ratingControl?.setValue(36);
        }
        if (scoreControl?.value > 80 || scoreControl?.value < 18) {
          scoreControl?.setValue(42);
        }
      } else {
        // 18-hole validation
        ratingControl?.setValidators([Validators.required, Validators.min(50), Validators.max(90)]);
        scoreControl?.setValidators([Validators.required, Validators.min(40), Validators.max(150)]);
        // Reset to reasonable 18-hole defaults if current values are out of range
        if (ratingControl?.value < 50 || ratingControl?.value > 90) {
          ratingControl?.setValue(72);
        }
        if (scoreControl?.value < 40) {
          scoreControl?.setValue(85);
        }
      }
      
      ratingControl?.updateValueAndValidity();
      scoreControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.roundForm.valid) {
      const formValue = this.roundForm.value;
      
      this.roundsService.addRound({
        date: formValue.date,
        courseName: formValue.courseName,
        courseRating: parseFloat(formValue.courseRating),
        slopeRating: parseInt(formValue.slopeRating),
        score: parseInt(formValue.score),
        numberOfHoles: formValue.numberOfHoles,
        teeColor: formValue.teeColor,
        weather: formValue.weather,
        notes: formValue.notes
      });

      this.snackBar.open('Round added successfully!', 'Close', {
        duration: 3000
      });

      this.router.navigate(['/']);
    } else {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 3000
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}