<script>
export default {
  name: "Playlists",
  props: {
    playlists: Array,
    playlistsVideos: Object,
  },
};
</script><template>
    <div class="playlists text-black">
      <div v-for="playlist in playlists" :key="playlist.id">
        <h2>{{ playlist.name }}</h2>
        <ul>
          <li v-for="video in playlistsVideos[playlist.id]" :key="video.id">
            {{ video.title }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  

  