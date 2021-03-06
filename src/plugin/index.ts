import { BehaviorSubject, Observable } from 'rxjs';



// start setup
export const setup = (videoId: string) => {

  const edVideo = new EdVideo(videoId);
  edVideo.showCurrentFrame();

  setTimeout(() => {
     const sharedBus = new SharedBus(videoId);
     console.log("sharedBus is active now...");
    }, 3000);

  // const sharedBus = new SharedBus(videoId);
}
// end setup


// // start Video
class EdVideo {
  public currentFrame = new BehaviorSubject(0);
  constructor(videoID: string) {
    console.log("EdVideo: ", videoID);
    const overlay = new Overlay(videoID);
    this.getCurrentFrame().subscribe(getCurrentFrameDetail => {
      console.log("getCurrentFrameDetail EdVideo:", getCurrentFrameDetail);
      overlay.showUpdatedFrameNumber(getCurrentFrameDetail);
    })
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
  constructor(videoID: string) {
    console.log("SharedBus: ", videoID);
    let edVideo = new EdVideo(videoID);
    const overlay = new Overlay(videoID);
    edVideo.getCurrentFrame().subscribe(getCurrentFrameDetail => {
      console.log("getCurrentFrameDetail SharedBus:", getCurrentFrameDetail);
      overlay.showUpdatedFrameNumber(getCurrentFrameDetail);
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












