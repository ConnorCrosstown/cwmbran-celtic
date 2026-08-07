"""
Live data from the FAW.

faw.cymru renders match pages client-side from Comet, and ships the API key in
its own front-end JavaScript. This reads the same public endpoints the site's
own pages read — the league table and individual matches — at a polite rate.

Responses are cached on disk so repeated builds don't hammer it.
"""
import json, os, time, urllib.request

KEY = 'ME8w7FdYVJQQJZJp7QwaDy8MRdrspAVqDcrxBeJ3'
BASE = 'https://api-faw.analyticom.de/api/live'
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.faw-cache')
TTL = 60 * 60 * 6        # the table moves at most once a matchday

COMPETITIONS = {
    'mens': 107495034,      # Ardal Southern League East 26/27
}


def _get(path, ttl=TTL):
    os.makedirs(CACHE, exist_ok=True)
    key = os.path.join(CACHE, path.replace('/', '_') + '.json')
    if os.path.exists(key) and time.time() - os.path.getmtime(key) < ttl:
        with open(key) as f:
            return json.load(f)
    # Cloudflare fronts this and 403s a bare urllib User-Agent, key or no key.
    req = urllib.request.Request(f'{BASE}/{path}', headers={
        'API_KEY': KEY,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    })
    data = json.loads(urllib.request.urlopen(req, timeout=30).read())
    with open(key, 'w') as f:
        json.dump(data, f)
    return data


def standings(team='mens'):
    """Official league table, in order. Raises if the competition isn't mapped —
    the women's Adran South sits on a different FAW site and isn't wired up."""
    if team not in COMPETITIONS:
        raise KeyError(f'no FAW competition mapped for {team!r}')
    return _get(f'competition/{COMPETITIONS[team]}/standings/official')
