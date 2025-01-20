import { Component, inject, AfterViewChecked } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push, off } from 'firebase/database';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

const app = initializeApp(environment);
const db = getDatabase(app);

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  private route = inject(ActivatedRoute);
  receiverId: string = '';
  receiverName : string = '';
  message: string = '';
  messages: any[] = [];
  senderId: string = ''; // Default empty, will be set from sessionStorage
  private currentMessageRef: any;

  constructor() {
    // Initialize senderId from sessionStorage or another mechanism
    this.senderId = sessionStorage.getItem("userId") || ''; // Make sure sessionStorage has userId set
  }

  // Send a message to the receiver
  sendMessage(receiverId: string, message: string): void {
    if (!message) return; // Prevent empty messages
    const chatKey = this.getChatKey(this.senderId, receiverId);
    const messageRef = ref(db, 'messages/' + chatKey);
    const newMessageRef = push(messageRef);
    set(newMessageRef, {
      senderId: this.senderId,
      receiverId: receiverId,
      message: message,
      timestamp: Date.now(),
    });
    this.message = ''; // Clear input
  }

  // Listen for new messages
  listenForMessages(): void {
    if (!this.senderId || !this.receiverId) {
      console.warn('Both senderId and receiverId are required to listen for messages.');
      return;
    }

    // Remove the previous listener
    if (this.currentMessageRef) {
      off(this.currentMessageRef);
    }

    const chatKey = this.getChatKey(this.senderId, this.receiverId);
    this.currentMessageRef = ref(db, 'messages/' + chatKey);

    onValue(this.currentMessageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.messages = Object.values(data).sort((a: any, b: any) => a.timestamp - b.timestamp);
      } else {
        this.messages = [];
      }
    });
  }

  // Generate a consistent chat key
  private getChatKey(senderId: string, receiverId: string): string {
    return [senderId, receiverId].sort().join('_');
  }

  // Scroll to the bottom of the message list when new messages are added
  ngAfterViewChecked() {
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Automatically listen for messages when receiverId changes
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.receiverId = params.get('id')!; 
      this.receiverName = params.get('name')!; // Assuming receiverId is passed as appointmentId
      this.listenForMessages();
    });
  }

  ngOnChanges(): void {
    this.listenForMessages();
  }
}
