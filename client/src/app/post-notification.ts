import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountState } from "./account-state";

import { IServerObject } from "./app.types"



@Injectable({providedIn: "root"})
export class PostNotification {


  constructor (private http: HttpClient, private state: AccountState) {


  }


  checkForChanges () {

    // Exit for Guests
    if (this.state.getCurrentUserInfo().username === "guest") return 

    const {lastUpdate, data :currentLog} = this.state.getChangeLog()
    
    this.http.get(this.state.getHost() + "/api/v1/CS569FP/posts/changes?datems=" + Date.parse(lastUpdate)).subscribe((n: any) => {

      if ((<IServerObject>n).status === "Success") {

        // Parse Dates
        var newLog = n.data.data.map( (n:any) =>({...n, changeDate: new Date(n.changeDate)}))
        
        // Compare New with Old
        newLog = newLog.reduce( (a: any, {_id, changeDate}: any) => {

          const cur = currentLog[_id]
          const dateChange = new Date(changeDate)

          if (cur) {

            // Do Not Add if User has Viewed Since Change
            if (cur.type === "view" && cur.changeDate > dateChange) return a

          }

          // Add Change to Log
          return ({...a, [_id]: {dateChange, type: "change"}})

        }, {})

        // Add Old Items Filtering Out Old Views
        Object.entries(currentLog).forEach( ([key, value]: any) => {

          // Remove Views - Only Needed to Check with New Changes
          if ( value.type === "view" ) return

          newLog = {...newLog, [key]: value}

        })

        // Update Notification Log
        this.state.setChangeLog({lastUpdate: new Date(n.data.checkDate), data: newLog})

      }



    })

  }


}