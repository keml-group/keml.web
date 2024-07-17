import {Injectable} from '@angular/core';
import {DiagramComponent, NodeModel} from "@syncfusion/ej2-angular-diagrams";
import {Conversation, ConversationPartner} from "../models/sequence-diagram-models";

@Injectable({
  providedIn: 'root'
})
export class DiagramService {

  constructor() { }

  loadModel(conv: Conversation, diagram: DiagramComponent) {
    diagram.clear();
    diagram.add(this.defineAuthor());
    diagram.addElements(this.defineConvPartners(conv.conversationPartners));
  }

  private defineAuthor(): NodeModel {
    return {
      id: 'author',
      // Position of the node
      offsetX: 0,
      offsetY: 0,
      // Size of the node
      width: 20,
      height: 50,
      annotations: [
        {
          content: 'Author',
          verticalAlignment: "Top",
          horizontalAlignment: "Center",
          offset: {x:0.5, y:1}
        }
      ],
      shape: {
        type: 'Native',
        content: this.personSVG()
      }
    };
  }

  private defineConvPartners(convP: ConversationPartner[]): NodeModel[] {
    // distance to first partner should be bigger than distance in between:
    const distanceToFirst: number = 400;
    const distanceBetween: number = 100;
    return [];
  }

  private personSVG(): string {
    return '<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://web.resource.org/cc/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" opacity="1" writing-mode="lr-tb" stop-color="rgb(0, 0, 0)" shape-rendering="auto" glyph-orientation-horizontal="0deg" color-profile="auto" lighting-color="rgb(255, 255, 255)" color="rgb(0, 0, 0)" font-weight="400" alignment-baseline="auto" font-style="normal" version="1.0" color-interpolation-filters="linearrgb" text-anchor="start" stroke-linecap="butt" color-interpolation="srgb" font-variant="normal" word-spacing="normal" fill-opacity="1" text-rendering="auto" clip-path="none" text-decoration="none" letter-spacing="normal" glyph-orientation-vertical="auto" display="inline" font-size-adjust="none" overflow="hidden" fill="rgb(0, 0, 0)" font-stretch="normal" stroke-dasharray="none" inkscape:version="0.45.1" id="svg1.svg2" stroke-miterlimit="4" stop-opacity="1" color-rendering="auto" font-size="12" sodipodi:docbase="C:\\Daten\\alberts\\projects\\yfx" pointer-events="visiblepainted" mask="none" direction="ltr" baseline-shift="baseline" sodipodi:docname="uml_actor.svg" enable-background="accumulate" fill-rule="nonzero" image-rendering="auto" stroke-dashoffset="0" inkscape:output_extension="org.inkscape.output.svg.inkscape" marker-end="none" width="41" clip="auto" cursor="auto" stroke="none" filter="none" visibility="visible" kerning="auto" stroke-width="1" font-family="&quot;Arial&quot;,&quot;Helvetica&quot;,sans-serif" flood-opacity="1" clip-rule="nonzero" src="none" height="68.997391" unicode-bidi="normal" sodipodi:version="0.32" stroke-linejoin="miter" stroke-opacity="1" flood-color="rgb(0, 0, 0)" dominant-baseline="auto" marker-start="none" marker-mid="none">\n' +
      '            \n' +
      '          <defs id="svg1.defs4">\n' +
      '            <clipPath clipPathUnits="userSpaceOnUse" id="clipPath1">\n' +
      '              <path d="M0 0 L68 0 L68 114 L0 114 L0 0 Z"/>\n' +
      '            </clipPath>\n' +
      '            <clipPath clipPathUnits="userSpaceOnUse" id="clipPath2">\n' +
      '              <path d="M371 233 L439 233 L439 347 L371 347 L371 233 Z"/>\n' +
      '            </clipPath>\n' +
      '            <clipPath clipPathUnits="userSpaceOnUse" id="clipPath3">\n' +
      '              <path d="M-16.1041 -22.1231 L56.9672 -22.1231 L56.9672 83.3615 L-16.1041 83.3615 L-16.1041 -22.1231 Z"/>\n' +
      '            </clipPath>\n' +
      '          </defs>\n' +
      '            \n' +
      '  \n' +
      '          <metadata id="svg1.metadata7">\n' +
      '    \n' +
      '  </metadata>\n' +
      '            \n' +
      '          <g inkscape:groupmode="layer" id="svg1.layer1" transform="translate(-29.5,-42.959476)" inkscape:label="Ebene 1">\n' +
      '                \n' +
      '            <a id="svg1.a3142" transform="matrix(1.0873906,0,0,1,-4.4741999,0)">\n' +
      '                    \n' +
      '              <path transform="translate(11.586889,5.2908993)" style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" sodipodi:cx="38.509369" sodipodi:cy="47.36993" sodipodi:rx="8.5197716" id="svg1.path2160" d="M 47.02914 47.36993 A 8.5197716 9.2013531 0 1 1  29.989597,47.36993 A 8.5197716 9.2013531 0 1 1  47.02914 47.36993 z" sodipodi:ry="9.2013531" sodipodi:type="arc"/>\n' +
      '                  \n' +
      '            </a>\n' +
      '                \n' +
      '            <path style="fill:none" sodipodi:cx="43.962021" sodipodi:cy="48.392303" d="M 47.71072 48.392303 A 3.7486994 0 0 1 1  40.213321,48.392303 A 3.7486994 0 0 1 1  47.71072 48.392303 z" id="svg1.path3134" sodipodi:rx="3.7486994" sodipodi:ry="0" sodipodi:type="arc"/>\n' +
      '                \n' +
      '            <path style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1.24319649px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M 50,61.33709 C 50,91.363211 50,92.247838 50,92.247838" id="svg1.path3136"/>\n' +
      '                \n' +
      '            <path style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M 69.760668,72.362183 C 69.760668,72.362183 69.760668,72.362183 50.239332,72.362183 C 30.239332,72.362183 30.239332,72.362183 30.239332,72.362183 L 30.239332,72.362183" id="svg1.path3138"/>\n' +
      '                \n' +
      '            <path style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M 30,111.45687 C 30,111.45687 30,111.45687 50,92.013532 C 70,111.45687 70,111.45687 70,111.45687" id="svg1.path3140"/>\n' +
      '              \n' +
      '          </g>\n' +
      '          \n' +
      '        </svg>'
  }
}
