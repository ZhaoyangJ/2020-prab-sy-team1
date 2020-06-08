import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {notificationService} from '../notificationservices/notification.service'
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-notificationb',
  templateUrl: './notificationb.component.html',
  styleUrls: ['./notificationb.component.css']
})
export class NotificationbComponent implements OnInit {

  data = {};
  constructor(
    private NotificationService: notificationService,
    public snackBar : MatSnackBar
  ) { }

  ngOnInit() {
    this.getAllNotifications();

  }

  drop(event: CdkDragDrop<string[]>)
  {
    if (event.previousContainer === event.container)
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);  
      }
      else{
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      this.updateNotification();
    }

    addNotification(todo)
    {
      const obj = {todo: todo.value};
      this.NotificationService.addNotification(obj)
      .subscribe((res: any) =>{
        this.openSnackBar(res.message);
        this.getAllNotifications();
        todo.value ='';
      },(err) => {
        console.log(err);
      });
    }
    

    getAllNotifications(){
    this.NotificationService.getAllNotifications()
    .subscribe((res) =>{
      console.log(res);
      Object.keys(res).forEach((Key) =>
      {
       this.data[Key] = res[Key];
      });
    }, (err) => {
      console.log(err);
    }); 
  }


  updateNotification(){
    this.NotificationService.updateNotification(this.data)
    .subscribe((res) =>{
      console.log(res);
    }, (err) => {
      console.log(err);
    });
  }

  removeNotification(id){
   if(confirm('are you share about to delete?')){
     this.NotificationService.removeNotification(id)
     .subscribe((res)=>{
       console.log(res);
       this.getAllNotifications();
     },(err) => {
       console.log(err);
     });
   }
  }

 openSnackBar(message: string){
   this.snackBar.open(message,'ok',{
     duration: 2000,
   });

 }

  }

