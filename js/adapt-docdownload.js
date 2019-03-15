define([ 'core/js/adapt', 'coreViews/componentView' ], function(Adapt, ComponentView) {
	var DocDownload = ComponentView.extend({
		events: {
			'click .docdownload-btn': 'onDocDownload'
		},

		/************************************** SETUP METHODS **************************************/

		setupEventListeners: function() {
			if (this.model.get('_setCompletionOn') === 'inview') {
				this.$('.component-widget').on('inview', _.bind(this.inview, this));
			}
		},

		preRender: function() {
			this.containerClass = '.docdownload-widget';
		},

		postRender: function() {
			this.setReadyStatus();
			this.setupEventListeners();
		},

		inview: function(event, visible, visiblePartX, visiblePartY) {
			if (visible) {
				if (visiblePartY === 'top') {
					this._isVisibleTop = true;
				} else if (visiblePartY === 'bottom') {
					this._isVisibleBottom = true;
				} else {
					this._isVisibleTop = true;
					this._isVisibleBottom = true;
				}

				if (this._isVisibleTop && this._isVisibleBottom) {
					this.$('.component-inner').off('inview');
					this.setCompletionStatus();
				}
			}
		},

		onDocDownload: function() {
			//console.log(Adapt, ' --> localStorage:', localStorage);
			var hashdata = this.processData();
			this.processDocDownload('document.doc', hashdata);
		},

		processData: function() {
			let store = new Array();

			_.each(this.model.get('_items'), function(item) {
				switch (item.component) {
					case 'openTextInput':
						let val =
							localStorage.getItem(item.id + '-OpenTextInput-UserAnswer') === undefined
								? ''
								: localStorage.getItem(item.id + '-OpenTextInput-UserAnswer');
						store[item.id] = val;

						break;
					case 'slider':
						store[item.id] = Adapt.findById(item.id).get('_userAnswer');
						break;
					default:
				}
			});

			let _str = this.model.get('_html');
			//
			let result = _str.replace(/(c-[0-9]+)/gi, (str, id, offset, input, groups) => {
				return '<div id="' + id + '">' + store[id] + '</div>'; //
			});
			//console.log(store, ' result ', result);

			return result;
		},

		processDocDownload: function(fileName, xmlstr) {
			var file = new Blob([ xmlstr ], {
				type: 'text/html'
			});

			var link = document.createElement('a'); // Or maybe get it from the current document
			link.href = URL.createObjectURL(file);
			link.download = fileName;
			link.click();

			//this.sendEmail(xmlstr);
		},

		sendEmail: function(data) {
			/*
			var person = prompt('Please enter your email', 'yourname@email.com');

			//send mail url: '', http://192.199.2.52/moodle32/scorm_api.php
			 $.ajax({
				type: 'POST',
				url: 'http://192.199.2.43/customEmailServices.php',
				data: { data: xmlstr, courseid: '9', email: person },
				success: function(response) {
					alert('email sent ', response);
				}
			}); 

			//.. OR SMPT services

			var service_id = 'default_service';
			var template_id = 'template_J49OCNNB';
			var template_params = {
				from_name: 'Sender',
				reply_to: 'sender@email.com',
				email_to: person,
				message_html: data
			};

			emailjs.send(service_id, template_id, template_params);
			*/
		}
	});

	Adapt.register('docdownload', DocDownload);
});
