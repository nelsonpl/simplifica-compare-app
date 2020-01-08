import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { MessageService } from '../../providers/message-service-rest';
import { AuthService } from '../../providers/auth-service-rest';
import { Message } from '../../models/message';

@IonicPage({
    name: 'page-message-list',
    segment: 'message-list'
})

@Component({
    selector: 'page-message-list',
    templateUrl: 'message-list.html'
})
export class MessageListPage implements OnInit {

    private page = 1;
    private complete: () => void;
    public messages: Array<any> = [];
    public isSearching: any = false;
    public isAuth = false;
    public isNotItems: boolean = false;

    constructor(private messageService: MessageService, private authService: AuthService) {
    }

    // methods start
    ngOnInit() {
        this.buildList();

        this.isAuth = this.authService.currentUserValue != null;
    }

    buildList() {
        this.page = 1;
        this.messages = [];
        this.getItems();
    }

    getItems(): void {
        this.messageService.getAll(this.page)
            .subscribe((items: Message[]) => {
                this.messages = this.messages.concat(items);
                this.isNotItems = true;
                if (items.length) {
                    this.page++;
                    this.isNotItems = false;
                }
                if (this.complete) {
                    this.complete();
                    this.complete = null;
                }
            });
    }
    // methods end

    // events start
    onRefresh(event) {
        this.complete = () => { event.complete(); };
        this.buildList();
    }

    onSearching() {
        this.isSearching = true;
    }

    onInfinite(event) {
        this.complete = () => { event.complete(); };
        this.getItems();
    }

    // events end


}
