import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {GcpService} from '../shared/services/gcp.service';
import {ServerStatus} from '../shared/classes/server-status';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-server-manager',
  templateUrl: './server-manager.component.html',
  styleUrls: ['./server-manager.component.scss']
})
export class ServerManagerComponent implements OnInit, OnDestroy {

  public serverStatus: ServerStatus = {status: 'UNKNOWN'};
  private API_URL = environment.API_URL;
  private MINECRAFT_FQDM = environment.MINECRAFT_FQDM;

  constructor(public auth: AngularFireAuth, private gcpService: GcpService) {
    this.gcpService.GetServerStatus().subscribe(res => this.reactToServerServerStatus(res));
  }

  public startServer(): void {
    this.gcpService.StartServer().subscribe(res => this.toggleServerStatus());
  }

  public stopServer(): void {
    this.gcpService.StopServer().subscribe(res => this.toggleServerStatus());
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  toggleServerStatus(): void {
    if (this.serverStatus.status === 'RUNNING') {
      this.serverStatus.status = 'TERMINATED';
    } else if (this.serverStatus.status === 'TERMINATED') {
      this.serverStatus.status = 'RUNNING';
    }
  }

  reactToServerServerStatus(serverStatus: ServerStatus[]): void {
    // @ts-ignore
    if (serverStatus.status === 'RUNNING') {
      this.serverStatus.status = 'RUNNING';
      // @ts-ignore
    } else if (serverStatus.status === 'TERMINATED') {
      this.serverStatus.status = 'TERMINATED';
    }
  }

}
