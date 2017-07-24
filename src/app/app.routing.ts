import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from '../components/main/main';

const routes: Routes = [
    { path: '', component: MainPageComponent },
    { path: '**', redirectTo: '/', pathMatch: 'full'}
]

export const routing = RouterModule.forRoot(routes);