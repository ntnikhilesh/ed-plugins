import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/database';



// start setup
export const setup = (videoId: string) => {

  const edVideo = new EdVideo(videoId);
  const overlay = new Overlay(videoId);
  edVideo.showCurrentFrame();
  const sharedBus = new SharedBus(videoId, edVideo, overlay);

  const database = new Database();
  database.dbConfig();
  database.addUser();

}
// end setup


// // start Video
class EdVideo {
  public currentFrame = new BehaviorSubject(0);
  constructor(videoID: string) {
    console.log("EdVideo: ", videoID);
  }

  showCurrentFrame() {
    setInterval(() => {
      console.log('showCurrentFrame...');
      this.checkCurrentFrame();
    }, 5000);
  }

  checkCurrentFrame() {
    console.log("checkCurrentFrame...");
    const video = document.getElementsByTagName('video');
    console.log("video detail:: ", video);
    let curTime = video[0].currentTime;
    let frameRate = 1;
    let theCurrentFrame = Math.floor(curTime * frameRate);
    this.updateCurrentFrame(theCurrentFrame);
  }

  //start updateCurrentFrame
  updateCurrentFrame(currentFrame: any) {
    console.log("updateCurrentFrame:", currentFrame);
    this.currentFrame.next(currentFrame);

  }
  // end updateLoginStatus

  //start getLoginStatus
  public getCurrentFrame(): Observable<any> {
    return this.currentFrame.asObservable();
  }
  //end getLoginStatus
}
// // end Video


// // start SharedBus
class SharedBus {
  constructor(videoID: string, private edVideo: EdVideo, private overlay: Overlay) {
    console.log("SharedBus: ", videoID);
    this.edVideo.getCurrentFrame().subscribe(getCurrentFrameDetail => {
      console.log("getCurrentFrameDetail SharedBus::", getCurrentFrameDetail);
      this.overlay.showUpdatedFrameNumber(getCurrentFrameDetail);
    })
  }

}
// end SharedBus

// // start Overlay
class Overlay {
  constructor(videoID: string) {
    console.log("Overlay: ", videoID);
  }


  // start showUpdatedFrameNumber
  showUpdatedFrameNumber(currentFrame: any) {
    if (currentFrame <= 0) {
      console.log("showUpdatedFrameNumber: ", currentFrame);
      const video = document.getElementsByTagName('video');
      const edContainer = document.createElement("div");
      edContainer.className = 'ed-container';
      const frameCountContainer = document.createElement("div");
      frameCountContainer.className = 'ed-frame-count-container';
      frameCountContainer.id = 'ed-frame-count-container';
      frameCountContainer.textContent = currentFrame;


      console.log("video detail: ", video);
      for (let i = 0; i < video.length; i++) {
        edContainer.appendChild(video.item(i));
        edContainer.appendChild(frameCountContainer);
        frameCountContainer.addEventListener("click", (e) => {
          console.log("edLogo clicked...");
          if (video.item(i).paused) {
            video.item(i).play();
          } else {
            video.item(i).pause();
          }
        });
        document.body.appendChild(edContainer);
      }

    } else {
      document.getElementById("ed-frame-count-container").innerHTML = currentFrame;
    }

  }
  // end showUpdatedFrameNumber


}
// // end Overlay


// start Database
class Database {
  constructor() {
    console.log("Database...");
  }

  // start dbConfig
  dbConfig() {
    console.log("dbConfig...");
    var firebaseConfig = {
      apiKey: "AIzaSyAJGVC-adum8xDKuGt9dju743sf10qXicc",
      authDomain: "ed-test-1.firebaseapp.com",
      projectId: "ed-test-1",
      storageBucket: "ed-test-1.appspot.com",
      messagingSenderId: "963017543930",
      appId: "1:963017543930:web:8cf4ce1038ea4ae3a8b943",
      measurementId: "G-F4HQM66D22"
    };
    var app = firebase.initializeApp(firebaseConfig);

  }
  // end dbConfig

  addUser() {
    console.log("addUser...");
    let userId = (new Date()).getTime();
    firebase.database().ref('users/' + userId).set({
      username: "nikhil" + new Date().toISOString(),
      email: "nikhilesh@edisn.ai"
    }, (error) => {
      if (error) {
        console.log("write failed:", error);
        // The write failed...
      } else {
        // Data saved successfully!
        console.log("Data saved successfully! " + userId);
      }
    });
  }

}
// end Database












