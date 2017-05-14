// exports N/xml module
var xml2js = require('xml2js');

var xmlNodeType = {
    ATTRIBUTE_NODE: 'ATTRIBUTE_NODE',
    CDATA_SECTION_NODE: 'CDATA_SECTION_NODE',
    COMMENT_NODE: 'COMMENT_NODE',
    DOCUMENT_FRAGMENT_NODE: 'DOCUMENT_FRAGMENT_​NODE',
    DOCUMENT_NODE: 'DOCUMENT_NODE',
    DOCUMENT_TYPE_NODE: 'DOCUMENT_TYPE_​NODE',
    ELEMENT_NODE: 'ELEMENT_NODE',
    ENTITY_NODE: 'ENTITY_NODE',
    ENTITY_REFERENCE_NODE: 'ENTITY_REFERENCE_NODE',
    NOTATION_NODE: 'NOTATION_NODE',
    PROCESSING_INSTRUCTION_NODE: 'PROCESSING_INSTRUCTION_NODE',
    TEXT_NODE: 'TEXT_NODE'
};

var xmlParser = {
    fromString: function(options) {
        //todo: TBD
    },
    toString: function(options) {
        //todo: TBD
    }
};

var xmlXPath = {
    select: function(options) {
        //todo: TBD
    }
};

var xmlDocument = Object.create(Object);

function xmlEscape() {
    //todo: TBD
}

function xmlValidate() {
    //toto: TBD
}



module.exports = {
    Parser: xmlParser,
    XPath: xmlXPath,
    Document: xmlDocument,
    NodeType: xmlNodeType,
    escape: xmlEscape,
    validate: xmlValidate
};