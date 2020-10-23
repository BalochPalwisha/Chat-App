import Sound from "react-native-sound";


class SoundHelper {

    playSound(path, cb) {

        try {

            this.sound = new Sound(path, "", error => {
                if (error) {
                    console.log('Error:', error)
                    alert("audio file not supported!")
                    return;
                }

                //console.log('duration in seconds: ' + this.sound.getDuration() + 'number of channels: ' + this.sound.getNumberOfChannels());

                let res = ""
                let err = ""
                let soundDuration = this.sound.getDuration()
                this.sound.play(success => {

                    if (success) {
                        console.log('successfully finished playing');
                        res = "success"
                        //  this.sound.reset();
            
                    } else {
                        console.log('playback failed due to audio decoding errors');
                        err = "error"
                        this.sound.reset();
                    }

                    cb(soundDuration, res, err)

                });
               
                
                
               
            });

        } catch (error) {
            console.log(error);
        }
    }

  


    pauseSound() {
        console.log("its working")
        try {
            this.sound.pause();
        } catch (error) {
            console.log(error);
        }
    }

    resumeSound(cb) {
        this.sound.play((success) => {
           cb(success);
        });
    }


    soundSetCurrentTime(value) {
        this.sound.setCurrentTime(value)
     }

    soundCurrentTime(cb) {
       this.sound.getCurrentTime((seconds)=> {
           cb(seconds);
          // alert("hello")
       })
    }

    // soundDuration (path) {
    //     alert(path)
       
    //       console.log("whoshhhh", whoosh.getDuration())
    // }
}


let soundHelper = new SoundHelper()

export default soundHelper;