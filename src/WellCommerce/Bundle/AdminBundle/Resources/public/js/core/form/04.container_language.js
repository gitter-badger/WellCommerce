/**
 * Default values
 *
 * @type {{sName: string, oClasses: {sRepetitionClass: string, sAddButtonClass: string, sDeleteButtonClass: string}, aoFields: Array, aoLanguages: Array, agFields: Array}}
 */
var oDefaults = {
    sName: '',
    oClasses: {
        sRepetitionClass: 'GFormRepetition',
        sAddButtonClass: 'add-repetition',
        sDeleteButtonClass: 'delete-repetition'
    },
    aoFields: [],
    aoLanguages: [],
    agFields: []
};

/**
 * GFormContainerLanguage
 *
 * @type {*}
 */
var GFormContainerLanguage = GCore.ExtendClass(GFormNode, function () {

    var gThis = this;

    gThis.m_oContainerRepetitions = {};
    gThis.m_iRepetitionIndex = 0;
    gThis.m_agFields = [];
    gThis.m_iChildIndex = 0;

    gThis._Constructor = function () {
        gThis.m_bRepeatable = true;
    };

    gThis._ConstructChildren = function () {

        for (var i = 0; i < gThis.m_oOptions.aoFields.length; i++) {
            var oField = gThis.m_oOptions.aoFields[i];
            var gChild = new oField.fType(oField);
            if (gChild._Constructor != undefined) {
                gChild._Constructor();
            }
            gThis.m_oOptions.agFields.push(gChild);
            gThis.m_agFields[gThis.m_iChildIndex++] = gChild;
        }
    };

    gThis.RenderChildren = function () {
        var jChildrenCollection = $('<div/>');
        for (var i = 0; i < gThis.m_oOptions.agFields.length; i++) {
            gThis._PrepareChild(gThis.m_oOptions.agFields[i]);
            jChildrenCollection.append(gThis.m_oOptions.agFields[i].Render());
        }
        return jChildrenCollection.children();
    };

    gThis._PrepareChild = function (gChild) {
        gChild.m_gForm = gThis.m_gForm;
        gChild.m_gParent = gThis;
        if (gChild.m_oOptions.sName != undefined) {
            gThis.m_gForm.m_ogFields[gChild.m_oOptions.sName] = gChild;
        }
        if (gThis.m_gParent == GCore.NULL) {
            gChild.m_sNamePrefix = '';
        }
        if (gThis.m_gForm == gThis.m_gParent) {
            gChild.m_sNamePrefix = gThis.m_oOptions.sName;
        }
        else {
            gChild.m_sNamePrefix = gThis.GetName();
        }
    };

    gThis.OnInit = function () {
        gThis._Initialize();
        gThis._InitializeEvents();
        for (var i = 0; i < gThis.m_iChildIndex; i++) {
            if (gThis.m_agFields[i] == undefined) {
                continue;
            }
            gThis.m_agFields[i].OnInit();
        }
        gThis._InitializeDependencies();
        gThis._InitializeRules();
    };

    gThis.OnShow = function () {
        for (var i = 0; i < gThis.m_iChildIndex; i++) {
            if (gThis.m_agFields[i] == undefined) {
                continue;
            }
            gThis.m_agFields[i].OnShow();
        }
    };

    gThis.OnRemove = function () {
        for (var i = 0; i < gThis.m_iChildIndex; i++) {
            if (gThis.m_agFields[i] == undefined) {
                continue;
            }
            gThis.m_agFields[i].OnRemove();
        }
    };

    gThis.OnHide = function () {
        for (var i = 0; i < gThis.m_iChildIndex; i++) {
            if (gThis.m_agFields[i] == undefined) {
                continue;
            }
            gThis.m_agFields[i].OnHide();
        }
    };

    gThis.OnReset = function () {
        for (var i = 0; i < gThis.m_iChildIndex; i++) {
            if (gThis.m_agFields[i] == undefined) {
                continue;
            }
            gThis.m_agFields[i].OnReset();
        }
    };

    gThis.Reset = function () {
        for (var i = 0; i < gThis.m_iChildIndex; i++) {
            if (gThis.m_agFields[i] == undefined) {
                continue;
            }
            gThis.m_agFields[i].Reset();
        }
    };

    gThis.Validate = function (bNoRequests) {
        var bResult = true;
        for (var i = 0; i < gThis.m_iChildIndex; i++) {
            if (gThis.m_agFields[i] == undefined) {
                continue;
            }
            if (!gThis.m_agFields[i].Validate(bNoRequests)) {
                bResult = false;
            }
        }
        return bResult;
    };

    gThis.AddRepetition = function (i) {

        var oOptions = GCore.Duplicate(gThis.m_oOptions, true);
        oOptions.sName = i;
        oOptions.agFields = [];
        oOptions.oRepeat = {};
        var gRepetition = new GFormRepetitionLanguage(oOptions);
        gRepetition._Constructor();
        gThis._PrepareChild(gRepetition);
        gThis.m_jNode.append(gRepetition.Render());
        gRepetition.OnInit();
        gThis.m_oContainerRepetitions[i] = gRepetition;
        gThis.m_agFields[gThis.m_iChildIndex++] = gRepetition;
        gRepetition.OnShow();
    };

    gThis.RemoveRepetition = function (i) {
        gRepetition = gThis.m_oContainerRepetitions[i];
        if (gRepetition == undefined) {
            return;
        }
        gRepetition.OnRemove();
        if (gRepetition.m_jNode != undefined) {
            gRepetition.m_jNode.remove();
        }
        for (var j in gThis.m_agFields) {
            if (gThis.m_oContainerRepetitions[i] == gThis.m_agFields[j]) {
                delete gThis.m_agFields[j];
            }
        }
        delete gThis.m_oContainerRepetitions[i];

    };

    gThis.Populate = function (mData) {


        $.each(gThis.m_oOptions.aoLanguages, function (l, language) {
            gThis.RemoveRepetition(language.sValue);
        });

        if (mData == undefined) {
            return;
        }
        var i;

        if (!GCore.ObjectLength(mData)) {
            return;
        }

        $.each(gThis.m_oOptions.aoLanguages, function (l, language) {
            gThis.AddRepetition(language.sValue);
        });

        for (var iFieldIndex in gThis.m_oOptions.aoFields) {
            var sFieldName = gThis.m_oOptions.aoFields[iFieldIndex].sName;

            for (var sRepetitionId in mData[sFieldName]) {
                var oValueObject = {};
                oValueObject[sFieldName] = mData[sFieldName][sRepetitionId];
                gThis.m_oContainerRepetitions[sRepetitionId].Populate(oValueObject);
            }
        }
    };

    gThis.PopulateErrors = function (mData) {
        if (mData == undefined) {
            return;
        }
        var i;

        for (i in mData) {
            if (gThis.m_oContainerRepetitions[i] != undefined) {
                gThis.m_oContainerRepetitions[i].PopulateErrors(mData[i]);
                console.log(mData[i]);
            }
        }

        for (var iFieldIndex in gThis.m_oOptions.aoFields) {
            var sFieldName = gThis.m_oOptions.aoFields[iFieldIndex].sName;
            for (var sRepetitionId in mData[sFieldName]) {
                var oValueObject = {};
                oValueObject[sFieldName] = mData[sFieldName][sRepetitionId];
                gThis.m_oContainerRepetitions[sRepetitionId].PopulateErrors(oValueObject);
            }
        }

    };

    gThis.Focus = function () {

        var aKeys = [];
        for (i in gThis.m_oContainerRepetitions) {
            aKeys.push(i);
        }
        aKeys.sort();
        for (i = 0; i < aKeys.length; i++) {
            var j = aKeys[i];
            if (gThis.m_oContainerRepetitions[j].Focus()) {
                return true;
            }
        }

        return false;
    };

    gThis._Initialize = function () {
    };

}, oDefaults);