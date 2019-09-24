import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TreeComponent} from "./tree/tree.component";
import {HomeComponent} from "./home/home.component";
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tree', component: TreeComponent },
  { path: 'connections', component: ChatComponent },
  { path: '', redirectTo: '', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
