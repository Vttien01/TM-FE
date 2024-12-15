import React from 'react';
import ReactQuill, { Quill } from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

const Parchment = Quill.import('parchment');
const customFontFamilyAttributor = new Parchment.Attributor.Style('custom-family-attributor', 'font-family');
const customSizeAttributor = new Parchment.Attributor.Style('custom-size-attributor', 'font-size');
const customColorAttributor = new Parchment.Attributor.Style('custom-color-attributor', 'color');
const ListItemBlot = Quill.import('formats/list/item');

const sizeConfig = {
    small: '12px',
    normal: '16px',
    large: '24px',
    huge: '40px',
};
class CustomListItem extends ListItemBlot {
    optimize(context) {
        super.optimize(context);

        if (this.children.length >= 1) {
            const child = this.children.head;
            const attributes = child?.attributes?.attributes;

            if (attributes) {
                for (const key in attributes) {
                    const element = attributes[key];
                    let name = element.attrName;
                    var value = element.value(child.domNode);
                    if (name === 'size') {
                        value = sizeConfig[value] || '16px';
                    }
                    if (name === 'color') super.format('custom-color-attributor', value);
                    else if (name === 'font-family') super.format('custom-family-attributor', value);
                    else if (name === 'size') super.format('custom-size-attributor', value);
                }
            } else {
                super.format('custom-color-attributor', false);
                super.format('custom-family-attributor', false);
                super.format('custom-size-attributor', false);
            }
        }
    }
}

Quill.register(customColorAttributor, true);
Quill.register(customFontFamilyAttributor, true);
Quill.register(customSizeAttributor, true);
Quill.register(CustomListItem, true);

const RichTextRender = ({ data, ...props }) => {
    return (
        <div className={'rich-text-render'}>
            <ReactQuill value={data} readOnly={true} theme={'bubble'} {...props} />
        </div>
    );
};

export default RichTextRender;
const Article = Quill.import('blots/block');
class ArticleBlot extends Article {
    static create(value) {
        let node = super.create();
        node.setAttribute('class', 'fck_detail');
        return node;
    }

    static tagName = 'article';
}
Quill.register(ArticleBlot);
