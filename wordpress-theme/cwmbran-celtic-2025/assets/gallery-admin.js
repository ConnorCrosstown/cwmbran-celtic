/**
 * The photo picker on the Match Gallery screen.
 *
 * WordPress's own media modal, opened with the current selection pre-loaded so
 * "Add or edit photos" is also how you remove and reorder — one button rather than
 * a bespoke interface nobody has used before.
 */
(function ($) {
	'use strict';

	var $wrap = $('#cc25gal-picker');
	if (!$wrap.length || typeof wp === 'undefined' || !wp.media) return;

	var $ids = $('#cc25gal-ids');
	var $thumbs = $('#cc25gal-thumbs');
	var frame = null;

	function current() {
		return String($ids.val() || '')
			.split(',')
			.map(function (n) { return parseInt(n, 10); })
			.filter(function (n) { return n > 0; });
	}

	function paint(attachments) {
		$thumbs.empty();
		var ids = [];
		attachments.forEach(function (a) {
			ids.push(a.id);
			// The thumbnail size may not exist yet for a just-uploaded file; the full
			// URL always does, so fall back to it rather than render a broken image.
			var sizes = a.sizes || {};
			var src = (sizes.thumbnail && sizes.thumbnail.url) || (sizes.full && sizes.full.url) || a.url;
			$thumbs.append(
				$('<span class="cc25gal-thumb">').attr('data-id', a.id).append(
					$('<img>').attr('src', src).attr('alt', a.alt || '')
				)
			);
		});
		$ids.val(ids.join(','));
	}

	$('#cc25gal-add').on('click', function (e) {
		e.preventDefault();

		// Rebuilt each time: the frame caches its selection, so reusing one shows a
		// stale set after a removal.
		frame = wp.media({
			title: 'Match photos',
			button: { text: 'Use these photos' },
			library: { type: 'image' },
			multiple: 'add'
		});

		frame.on('open', function () {
			var sel = frame.state().get('selection');
			current().forEach(function (id) {
				var att = wp.media.attachment(id);
				att.fetch();
				sel.add(att ? [att] : []);
			});
		});

		frame.on('select', function () {
			paint(frame.state().get('selection').toJSON());
		});

		frame.open();
	});

	$('#cc25gal-clear').on('click', function (e) {
		e.preventDefault();
		if (!current().length) return;
		if (!window.confirm('Remove all photos from this gallery? The files stay in the media library.')) return;
		$thumbs.empty();
		$ids.val('');
	});
})(jQuery);
