import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CourseRoutingModule } from './course-routing.module';
import { ListComponent } from './components/list/list.component';
import { CourseService } from 'src/app/helpers/services/course/course.service'; 


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CourseRoutingModule
  ],
  providers: [CourseService]
})
export class CourseModule { }
