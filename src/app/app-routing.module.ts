import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent }     from './products/products.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { ProfitsComponent } from './components/profits/profits.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
    { path: '', component: DashboardComponent},
  { path: 'products', component: ProductsComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'profits', component: ProfitsComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
