<template>
  <div id="jitsi-meet" style="position: absolute; height: 100%; left:0px; top:0px"></div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GlobalsStore from "@/store/modules/globals";

declare const JitsiMeetExternalAPI: any;

@Component({
  name: "AppointmentVideoCall"
})
export default class AppointmentVideoCall extends Vue {

  jitsiData: { domainjit: string, optionsjit: any, apijit: any } = { domainjit: '', optionsjit: null, apijit: null }
  pass = 'RTt566K'

  title = 'Sisidox | Video llamada de cita'

  created(): void {
    document.title = this.title;
  }

  mounted(): void {
    this.jitsiData.domainjit = 'meet.jit.si';
    this.jitsiData.optionsjit = {
        roomName: this.$route.params.bookedApptId,
        width: GlobalsStore.NativeWindow.innerWidth,
        height: GlobalsStore.NativeWindow.innerHeight,
        parentNode: document.querySelector('#jitsi-meet'),
    };

    this.jitsiData.apijit = new JitsiMeetExternalAPI(this.jitsiData.domainjit, this.jitsiData.optionsjit);
          
    // set new password for channel
    this.jitsiData.apijit.addEventListener('participantRoleChanged', (event: any) => {
      if (event.role === "moderator") {
        this.jitsiData.apijit.executeCommand('password', this.pass );
      }
    });
    // join a protected channel
    this.jitsiData.apijit.on('passwordRequired', () => {
      this.jitsiData.apijit.executeCommand('password', this.pass );
    });

  }

}
</script>