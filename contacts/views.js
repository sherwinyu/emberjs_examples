App.DeleteNumberView = Ember.View.extend({
  classNames: ['delete-number-view'],
  click: function() {
    var phoneNumber = this.get('content');
    var contact = this.getPath('contentView.content');

    contact.get('phoneNumbers').removeObject(phoneNumber);
  },

  touchEnd: function() {
    this.click();
  }
});

App.EditField = Ember.View.extend({
  tagName: 'span',
  templateName: 'edit-field',

  doubleClick: function() {
    this.set('isEditing', true);
    return false;
  },

  touchEnd: function() {
    // Rudimentary double tap support, could be improved
    var touchTime = new Date();
    if (this._lastTouchTime && touchTime - this._lastTouchTime < 250) {
      this.doubleClick();
      this._lastTouchTime = null;
    } else {
      this._lastTouchTime = touchTime;
    }

    // Prevent zooming
    return false;
  },

  focusOut: function() {
    this.set('isEditing', false);
  },

  keyUp: function(evt) {
    if (evt.keyCode === 13) {
      this.set('isEditing', false);
    }
  }
});

App.TextField = Ember.TextField.extend({
  didInsertElement: function() {
    this.$().focus();
  }
});

Ember.Handlebars.registerHelper('editable', function(path, options) {
  options.hash.valueBinding = path;
  return Ember.Handlebars.helpers.view.call(this, App.EditField, options);
});

Ember.Handlebars.registerHelper('button', function(options) {
  var hash = options.hash;

  if (!hash.target) {
    hash.target = "App.contactsController";
  }
  return Ember.Handlebars.helpers.view.call(this, Ember.Button, options);
});

App.ContactListView = Ember.View.extend({
  classNameBindings: ['isSelected'],

  click: function() {
    var content = this.get('content');

    App.selectedContactController.set('content', content);
  },

  touchEnd: function() {
    this.click();
  },

  isSelected: function() {
    var selectedItem = App.selectedContactController.get('content'),
        content = this.get('content');

    if (content === selectedItem) { return true; }
  }.property('App.selectedContactController.content')
});

App.CardView = Ember.View.extend({
  contentBinding: 'App.selectedContactController.content',
  classNames: ['card'],

  addPhoneNumber: function() {
    var phoneNumbers = this.getPath('content.phoneNumbers');
    phoneNumbers.pushObject({ number: '' });
  }
});

