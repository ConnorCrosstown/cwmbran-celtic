/**
 * Keep the league table right on a page the CDN may have cached weeks ago.
 *
 * The page ships a server-rendered table, which is what search engines and
 * anyone without JavaScript get. This asks the no-store endpoint whether that
 * table is still current and swaps the rows if it is not. On a fresh page it
 * finds nothing to do and changes nothing.
 */
(function () {
  'use strict';
  var mounts = document.querySelectorAll('[data-ccf-table]');
  if (!mounts.length || !window.fetch || !window.CCF_TABLE) return;

  Array.prototype.forEach.call(mounts, function (mount) {
    var team = mount.getAttribute('data-ccf-table') || 'mens';
    var url = CCF_TABLE.endpoint + (CCF_TABLE.endpoint.indexOf('?') === -1 ? '?' : '&') + 'team=' + encodeURIComponent(team);

    fetch(url, { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;

        // Never blank a table that is on the page: an endpoint returning nothing
        // means the feed is cold, and stale standings beat no standings.
        var tbody = mount.querySelector('tbody');
        if (tbody && data.html && data.html !== tbody.innerHTML) {
          tbody.innerHTML = data.html;
          // A page cached while the feed was cold shows the empty-state message;
          // now that there are rows, swap it for the table it was standing in for.
          mount.classList.remove('is-empty');
          var msg = mount.querySelector('[data-ccf-empty]');
          if (msg) msg.hidden = true;
        }

        var stamp = mount.querySelector('[data-ccf-updated]');
        if (stamp && data.updatedLabel) {
          stamp.textContent = (data.stale ? 'Last updated ' : 'Updated ') + data.updatedLabel;
        }
      })
      .catch(function () { /* leave the rendered table exactly as it is */ });
  });
})();
