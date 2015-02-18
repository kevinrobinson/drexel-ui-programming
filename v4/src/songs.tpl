<div class="songs">
  <h3>
    Songs
    <button class="add-song">add</button>
  </h3>
  <ul class="songs">
    <% songs.map(function(song) { %>
      <li>
        <iframe class="ytplayer" type="text/html" width="64" height="64" src="http://www.youtube.com/embed/<%= song.youTubeId %>" frameborder="0"></iframe>
        <span>
          <a href="/songs/<%= song.id %>" data-song-id="<%= song.id %>" class="song"><%= song.title %></a>
          <a class="small" href="<%= song.source %>">source</a>
        </span>
      </li>
    <% }); %>
  </ul>
</div>