<div class="songs">
  <h3>
    Songs
    <button class="add-song">add</button>
  </h3>
  <ul class="songs">
    <% songs.map(function(song) { %>
      <li>
        <iframe class="ytplayer" type="text/html" width="64" height="64" src="http://www.youtube.com/embed/<%= song.youTubeId %>" frameborder="0"></iframe>
        <span class="title"><%= song.title %></span>
        <a href="<%= song.source %>">source</a>
      </li>
    <% }); %>
  </ul>
</div>