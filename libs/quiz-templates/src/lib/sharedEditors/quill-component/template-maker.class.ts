import Quill from 'quill';
let Embed = Quill.import('blots/embed');
export class TemplateMarker extends Embed {
  static blotName: string;
  static tagName: string;

  static create(value) {
    console.log('I M In create', this.blotName);
    let node = super.create(value);

    node.setAttribute('class', 'badge badge-warning');
    //Set up the badge, and badge colour

    node.setAttribute('data-marker', 'Response');
    //The marker is the $ rel_table[id] reference

    node.setAttribute('data-title', 'Response');
    //

    node.innerHTML = this.tagName;
    //The title is what the user sees in their editor

    return node;
  }

  static value(node) {
    return {
      marker: node.getAttribute('data-marker'),
      title: node.getAttribute('data-title')
    };
  }
}
