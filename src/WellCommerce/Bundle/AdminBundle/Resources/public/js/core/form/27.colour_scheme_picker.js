/*
* COLOUR SCHEME PICKER
*/

var oDefaults = {
	sName: '',
	sLabel: '',
	oClasses: {
		sFieldClass: 'field-colour',
		sFieldSpanClass: 'field',
		sPrefixClass: 'prefix',
		sSuffixClass: 'suffix',
		sFocusedClass: 'focus',
		sInvalidClass: 'invalid',
		sRequiredClass: 'required',
		sWaitingClass: 'waiting',
		sFieldRepetitionClass: 'repetition',
		sAddRepetitionClass: 'add-field-repetition',
		sRemoveRepetitionClass: 'remove-field-repetition',
		sColourTypeClass: 'colour-type',
		sColourStartClass: 'colour-start',
		sColourEndClass: 'colour-end',
		sColourPreviewClass: 'colour-preview',
		sAddFilesClass: 'add-pictures',
		sQueueClass: 'upload-queue',
		sProgressClass: 'progress',
		sProgressBarClass: 'progress-bar',
		sProgressBarIndicatorClass: 'indicator',
		sUploadErrorClass: 'upload-error',
		sUploadSuccessClass: 'upload-success'
	},
	oImages: {
		sChooseIcon: 'images/icons/datagrid/edit.png',
		sDeleteIcon: 'images/icons/datagrid/delete.png',
		sUploadButton: 'images/buttons/add-pictures.png'
	},
	sFieldType: 'text',
	sDefault: '',
	aoRules: [],
	sComment: '',
	aoTypes: [
		{sValue: '1', sLabel: 'colour_scheme_picker_colour', sFlag: 'bAllowColour'},
		{sValue: '2', sLabel: 'colour_scheme_picker_gradient', sFlag: 'bAllowGradient'},
		{sValue: '3', sLabel: 'colour_scheme_picker_image', sFlag: 'bAllowImage'}
	],
	bAllowColour: true,
	bAllowGradient: true,
	bAllowImage: false,
	sUploadUrl: '',
	sSessionId: '',
	sSessionName: '',
	asFileTypes: [],
	sFileTypesDescription: '',
	fDeleteFile: GCore.NULL,
	fLoadFiles: GCore.NULL,
	sSwfUploadUrl: '_data_panel/swfupload.swf',
	iWidth: 131,
	iHeight: 34,
	iMaxFileSize: 100 * 1024,	// kB
	sSelector: '',
	iGradientHeight: 16
};

var GFormColourSchemePicker = GCore.ExtendClass(GFormTextField, function() {
	
	var gThis = this;
	
	gThis.m_jRepetitionNode;
	gThis.m_jColourTypeNode;
	gThis.m_jColourStartNode;
	gThis.m_jColourEndNode;
	gThis.m_jColourPreviewNode;
	gThis.m_jFieldColourType;
	gThis.m_jFieldColourStart;
	gThis.m_jFieldColourEnd;

	gThis.m_jFileField;
	gThis.m_bShown = false;
	gThis.m_jFilesDatagrid;
	gThis.m_gDataProvider;
	gThis.m_gFilesDatagrid;
	gThis.m_jSelectedFiles;
	gThis.m_jSwfUpload;
	gThis.m_jQueue;
	gThis.m_iUploadsInProgress = 0;
	gThis.m_iLockId = -1;
	gThis.m_bLoadedDefaults = false;
	gThis.m_jChooseButton;
	gThis.m_jSelectedFileName;
	gThis.m_jFileSelector;
	gThis.m_jFilePosition;
	gThis.m_jFileRepeat;
	gThis.m_jFileRepeatField;
	
	gThis.m_sCWD;
	
	gThis._PrepareNode = function() {
		gThis.m_jNode = $('<div/>').addClass(gThis._GetClass('Field'));
		var jLabel = $('<label for="' + gThis.GetId() + '"/>');
		jLabel.text(gThis.m_oOptions.sLabel);
		if ((gThis.m_oOptions.sComment != undefined) && (gThis.m_oOptions.sComment.length)) {
			jLabel.append(' <small>' + gThis.m_oOptions.sComment + '</small>');
		}
		gThis.m_jNode.append(jLabel);
		gThis.m_jNode.append(gThis._AddField());
		if ((gThis.m_oOptions.sSelector != undefined) && (gThis.m_oOptions.sSelector.length)) {
			gThis.m_jNode.append('<input type="hidden" name="' + gThis.GetName() + '[selector]" value="' + gThis.m_oOptions.sSelector + '"/>');
		}
		gThis.m_jNode.append('<input type="hidden" name="' + gThis.GetName() + '[gradient_height]" value="' + gThis.m_oOptions.iGradientHeight + '"/>');
	};

	gThis.Populate = function(mValue) {
		if (gThis.m_gFilesDatagrid) {
			gThis._UpdateDatagridSelection(mValue['file']);
		}
		gThis.SetValue(mValue);
	};
	
	gThis._UpdateDatagridSelection = function(mValue) {
		if (!(mValue instanceof Array)) {
			if ((mValue == undefined) || !mValue.length) {
				mValue = [];
			}
			else {
				mValue = [mValue];
			}
		}
		gThis.m_gFilesDatagrid.m_asSelected = [];
		for (var i = 0; i < mValue.length; i++) {
			gThis.m_gFilesDatagrid.m_asSelected[i] = mValue[i];
		}
		if (gThis.m_bShown) {
			gThis.m_gFilesDatagrid.LoadData();
		}
	};
	
	gThis.GetValue = function(sRepetition) {
		if (gThis.m_jFileField == undefined) {
			return {};
		}
		return {
			file: gThis.m_jFileField.val()
		};
	};
	
	gThis.SetValue = function(mValue, sRepetition) {
		if (mValue == undefined) {
			return;
		}
		if (mValue['type'] != undefined) {
			gThis.m_jFieldColourType.val(mValue.type).triggerHandler('change');
			gThis.m_jFieldColourStart.val(mValue.start);
			gThis.m_jFieldColourEnd.val(mValue.end);
		}
		if (mValue['repeat'] != undefined) {
			gThis.m_jFileRepeatField.val(mValue['repeat']);
		}
		if (mValue['position'] != undefined) {
			gThis.m_jFilePosition.find('input[value="' + mValue['position'] + '"]').click();
		}
		if (mValue['file'] == undefined) {
			gThis.m_jFileField.val('');
			gThis.m_jSelectedFileName.html('<span class="none">' + GForm.Language.localfile_none_selected + '</span>');
		}
		else {
			gThis.m_jFileField.val(mValue['file']).triggerHandler('change');
			gThis.m_jSelectedFileName.text(mValue['file']);
			if (gThis.m_jFieldColourType.val() == '3') {
				gThis.m_jColourPreviewNode.css({
					'background-image': 'url(\'' + GCore.DESIGN_PATH.substr(0, GCore.DESIGN_PATH.lastIndexOf('/', GCore.DESIGN_PATH.length - 2)) + '/' + gThis.m_oOptions.sFilePath + gThis.m_jFileField.val() + '\')'
				});
			}
			if (gThis.m_gFilesDatagrid) {
				gThis.m_gFilesDatagrid.m_asSelected = [gThis.m_oOptions.sFilePath + mValue['file']];
			}
		}
		gThis.UpdatePreview();
	};
	
	gThis.UpdatePreview = function() {
		gThis.m_jColourPreviewNode.empty();
		gThis.m_jColourPreviewNode.css({
			'background-color': (gThis.m_jFieldColourStart.val() == 'transparent') ? 'transparent' : "#" + gThis.m_jFieldColourStart.val(),
			'background-image': 'none'
		});
		switch(gThis.m_jFieldColourType.val()) {
			case '1': //kolor
				gThis.m_jColourEndNode.css('visibility', 'hidden');
				gThis.m_jFileSelector.css('display', 'none');
				gThis.m_jFilePosition.css('display', 'none');
				gThis.m_jFileRepeat.css('display', 'none');
				break;
			
			case '2': //gradient
				gThis.m_jColourEndNode.css('visibility', 'visible');
				gThis.m_jFileSelector.css('display', 'none');
				gThis.m_jFilePosition.css('display', 'none');
				gThis.m_jFileRepeat.css('display', 'none');
				gThis.m_jColourPreviewNode.gradient({
					from:      gThis.m_jFieldColourStart.val(),
					to:        gThis.m_jFieldColourEnd.val(),
					direction: 'horizontal'
				});
				break;
			
			case '3': //plik
				gThis.m_jColourPreviewNode.css({
					'background-image': 'url(\'' + GCore.DESIGN_PATH.substr(0, GCore.DESIGN_PATH.lastIndexOf('/', GCore.DESIGN_PATH.length - 2)) + '/' + gThis.m_oOptions.sFilePath + gThis.m_jFileField.val() + '\')',
					'background-repeat': gThis.m_jFileRepeatField.find('option:selected').attr('value'),
					'background-position': gThis.m_jFilePosition.find('input:checked').attr('value')
				});
				gThis.m_jColourStartNode.css('visibility', 'visible');
				gThis.m_jColourEndNode.css('visibility', 'hidden');
				gThis.m_jFileSelector.css('display', 'block');
				gThis.m_jFilePosition.css('display', 'block');
				gThis.m_jFileRepeat.css('display', 'block');
				break;
		}
	};
	
	gThis._AddField = function(sId) {
		
		var jColourTypeNode = $('<span class="' + gThis._GetClass('ColourType') + ' ' + gThis._GetClass('FieldSpan') +  '"/>');
		var jColourStartNode = $('<span class="' + gThis._GetClass('ColourStart') + '"/>');
		var jColourEndNode = $('<span class="' + gThis._GetClass('ColourEnd') + '"/>');

		var jColourPreviewNode = $('<span class="' + gThis._GetClass('ColourPreview') + '"/>');
		var jRepetitionNode = $('<span class="' + gThis._GetClass('FieldRepetition') + '"/>');
		
		var jFieldColourType = $('<select id="'+gThis.GetId()+'" name="' + gThis.GetName() + '[type]" />');
		for (var i = 0; i < gThis.m_oOptions.aoTypes.length; i++) {
			var oType = gThis.m_oOptions.aoTypes[i];
			if (gThis.m_oOptions[oType.sFlag]) {
				jFieldColourType.append('<option value="' + oType.sValue + '">' + GForm.Language[oType.sLabel] + '</option>');
			}
		}
		
		var jFieldColourStart = $('<input type="text" name="' + gThis.GetName() + '[start]" />');
		var jFieldColourEnd = $('<input type="text" name="' + gThis.GetName() + '[end]" />');


		jColourTypeNode.append(jFieldColourType);
		jColourStartNode.append($('<span class="' + gThis._GetClass('FieldSpan') + '"/>').append(jFieldColourStart));
		jColourEndNode.append($('<span class="' + gThis._GetClass('FieldSpan') + '"/>').append(jFieldColourEnd));
		
		jRepetitionNode.append($('<span class="' + gThis._GetClass('ColourPreview') + '-container"/>').append(jColourPreviewNode)).append(jColourTypeNode).append(jColourStartNode).append(jColourEndNode);

		gThis.m_jRepetitionNode = jRepetitionNode;
		gThis.m_jColourTypeNode = jColourTypeNode;
		gThis.m_jColourStartNode = jColourStartNode;
		gThis.m_jColourEndNode = jColourEndNode;
		gThis.m_jColourPreviewNode = jColourPreviewNode;
		gThis.m_jFieldColourType = jFieldColourType;
		gThis.m_jFieldColourStart = jFieldColourStart;
		gThis.m_jFieldColourEnd = jFieldColourEnd;
		
		gThis.m_jFileSelector = $('<div style="clear: both; padding-top: 10px;"/>');
		
		gThis.m_jSelectedFileName = $('<span class="filename"/>');
		gThis.m_jFileSelector.append(gThis.m_jSelectedFileName);
		gThis.m_jSwfUpload = $('<div class="' + gThis._GetClass('AddFiles') + '"/>').append('<span id="' + gThis.GetId() + '__upload"/>');
		gThis.m_jFileSelector.append(gThis.m_jSwfUpload);
		gThis.m_jChooseButton = $('<a href="#" class="button"><span><img src="' + gThis._GetImage('ChooseIcon') + '" alt=""/>' + GForm.Language.localfile_select + '</span></a>');
		gThis.m_jFileSelector.append($('<span class="browse-pictures"/>').append(gThis.m_jChooseButton));
        gThis.m_jQueue = $('<ul class="' + gThis._GetClass('Queue') + '" id="' + gThis.GetId() + '__queue"/>');
		gThis.m_jFileSelector.append(gThis.m_jQueue);
		gThis.m_jFilesDatagrid = $('<div/>');
		gThis.m_jFileSelector.append(gThis.m_jFilesDatagrid);
		gThis.m_jSelectedFiles = $('<div class="' + gThis._GetClass('SelectedTable') + '"/>');
		gThis.m_jFileSelector.append(gThis.m_jSelectedFiles);
		gThis.m_jFileField = $('<input type="hidden" name="' + gThis.GetName() + '[file]"/>');
		gThis.m_jFileSelector.append(gThis.m_jFileField);
		jRepetitionNode.append(gThis.m_jFileSelector);
		
		gThis.m_jFileRepeat = $('<div class="bg-repeat"/>').append('<label for="' + gThis.GetId() + '__position">' + GForm.Language.colour_scheme_picker_background_repeat + '</label>');
		gThis.m_jFileRepeatField = $('<select name="' + gThis.GetName() + '[repeat]" id="' + gThis.GetId() + '__position"/>');
		var asRepeatModes = [
			['no-repeat', GForm.Language.colour_scheme_picker_background_repeat_no],
			['repeat-x', GForm.Language.colour_scheme_picker_background_repeat_x],
			['repeat-y', GForm.Language.colour_scheme_picker_background_repeat_y],
			['repeat', GForm.Language.colour_scheme_picker_background_repeat_xy]
		];
		for (var i = 0; i < asRepeatModes.length; i++) {
			gThis.m_jFileRepeatField.append('<option value="' + asRepeatModes[i][0] + '"' + ((asRepeatModes[i][0] == 'repeat-x') ? ' selected="selected"' : '') + '>' + asRepeatModes[i][1] + '</option>');
		}
		gThis.m_jFileRepeat.append($('<span class="field"/>').append(gThis.m_jFileRepeatField));
		jRepetitionNode.append(gThis.m_jFileRepeat);
		
		gThis.m_jFilePosition = $('<div class="bg-position"/>').append('<label>' + GForm.Language.colour_scheme_picker_background_position + '</label>');
		jPositionRadios = $('<div/>');
		var asPositions = [
			'0 0', 'center 0', 'right 0',
			'0 center', 'center center', 'right center',
			'0 bottom', 'center bottom', 'right bottom'
		];
		for (var i = 0; i < asPositions.length; i++) {
			jPositionRadios.append('<input type="radio" name="' + gThis.GetName() + '[position]" value="' + asPositions[i] + '"' + ((asPositions[i] == '0 0') ? ' checked="checked"' : '') + '/>');
		}
		gThis.m_jFilePosition.append(jPositionRadios);
		jRepetitionNode.append(gThis.m_jFilePosition);
		
		gThis.m_jField = jRepetitionNode.find('input');
		
		return jRepetitionNode;
	};
	
	gThis._OnChoose = GEventHandler(function(eEvent) {
		gThis.m_jFilesDatagrid.slideToggle(250);
		if (!gThis.m_gFilesDatagrid) {
			gThis._InitFilesDatagrid();
		}
		return false;
	});
	
	gThis._InitializeEvents = function() {
		
		gThis.m_jChooseButton.click(gThis._OnChoose);

		gThis.m_jFieldColourType.change(function() {
			gThis.UpdatePreview();
		});
		
		gThis.m_jFieldColourStart.ColorPicker({
			color: '#' + gThis.m_jFieldColourStart.val(),
			onBeforeShow: function () {
				$(this).ColorPickerSetColor(this.value);
			},
			onShow: function(colpkr) {
				$(colpkr).fadeIn(250);
				gThis.m_jFieldColourStart.closest('.field').addClass('focus');
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(250);
				gThis.m_jFieldColourStart.triggerHandler('change');
				gThis.m_jFieldColourStart.closest('.field').removeClass('focus');
				return false;
			},
			onChange: function(hsb, hex, rgb) {
				gThis.UpdatePreview();
				gThis.m_jFieldColourStart.val(hex);
			}
		}).change(GEventHandler(function(eEvent) {
			gThis.UpdatePreview();
		}));
		gThis.m_jFieldColourEnd.ColorPicker({
			color: '#' + gThis.m_jFieldColourEnd.val(),
			onBeforeShow: function () {
				$(this).ColorPickerSetColor(this.value);
			},
			onShow: function(colpkr) {
				$(colpkr).fadeIn(250);
				gThis.m_jFieldColourEnd.closest('.field').addClass('focus');
				return false;
			},
			onHide: function(colpkr) {
				$(colpkr).fadeOut(250);
				gThis.m_jFieldColourEnd.triggerHandler('change');
				gThis.m_jFieldColourEnd.closest('.field').removeClass('focus');
				return false;
			},
			onChange: function(hsb, hex, rgb) {
				gThis.UpdatePreview();
				gThis.m_jFieldColourEnd.val(hex);
			}
		}).change(GEventHandler(function(eEvent) {
			gThis.UpdatePreview();
		}));
		
		gThis.m_jFieldColourType.GSelect().focus(GEventHandler(function(eEvent) {
			$(this).closest('.field').addClass('focus');
		})).blur(GEventHandler(function(eEvent) {
			$(this).closest('.field').removeClass('focus');
		}));
		
		gThis.m_jFileRepeatField.GSelect().focus(GEventHandler(function(eEvent) {
			$(this).closest('.field').addClass('focus');
		})).blur(GEventHandler(function(eEvent) {
			$(this).closest('.field').removeClass('focus');
		})).change(GEventHandler(function(eEvent) {
			gThis.UpdatePreview();
		}));
		
		gThis.m_jFilePosition.find('input').click(GEventHandler(function(eEvent) {
			gThis.UpdatePreview();
		}));
		
	};

	gThis.Reset = function() {
		gThis.m_jField.eq(0).val(gThis.m_oOptions.sDefault).change();
		gThis.UpdatePreview();
	};
	
	gThis.Focus = function() {
		return true;
	};
	
	gThis._OnClickRow = function(gDg, sId) {
		var oFile = gThis.m_gFilesDatagrid.GetRow(sId);
		if (oFile.dir) {
			if (oFile.name == '..') {
				gThis.m_sCWD = gThis.m_sCWD.substr(0, gThis.m_sCWD.lastIndexOf('/', gThis.m_sCWD.length - 2));
			}
			else {
				gThis.m_sCWD += oFile.name + '/';
			}
			gThis.m_jSwfUpload.swfupload('addPostParam', 'path', gThis.m_sCWD);
			gThis._RefreshFiles();
			return false;
		}
		return true;
	};
	
	gThis._OnSelect = function(gDg, sId) {
		var oFile = gDg.GetRow(sId);
		if (!oFile.dir) {
			gThis.SetValue({
				file: oFile.path.substr(gThis.m_oOptions.sFilePath.length)
			});
		}
	};

	gThis._OnDeselect = function(gDg, sId) {
		gThis.SetValue('');
		gThis.m_jFileField.triggerHandler('change');
	};
	
	gThis._Initialize = function() {
		var oValue = gThis.GetValue();
		var sPath = gThis.m_oOptions.sFilePath + oValue.file;
		sPath = sPath.substr(0, sPath.lastIndexOf('/') + 1);
		gThis.m_sCWD = sPath;
	};
	
	gThis.OnShow = function() {
		if (!gThis.m_bShown) {
			gThis._InitUploader();
			gThis.m_bShown = true;
		}
	};

	gThis._ProcessFile = function(oRow) {
		if (oRow.dir) {
			if (oRow.name == '..') {
				oRow.thumbpreview = '<img src="' + gThis.m_oOptions.oTypeIcons['cdup'] + '" alt=""/>';
			}
			else {
				oRow.thumbpreview = '<img src="' + gThis.m_oOptions.oTypeIcons['directory'] + '" alt=""/>';
			}
		}
		else {
			var sExtension = oRow.name.substr(oRow.name.lastIndexOf('.') + 1);
			if (gThis.m_oOptions.oTypeIcons[sExtension] == undefined) {
				sExtension = 'unknown';
			}
			if ((sExtension == 'png') || (sExtension == 'jpg') || (sExtension == 'gif')) {
				oRow.thumbpreview = '<a href="' + GCore.DESIGN_PATH.substr(0, GCore.DESIGN_PATH.lastIndexOf('/', GCore.DESIGN_PATH.length - 2)) + '/' + oRow.path + '" class="show-thumb"><img src="' + gThis.m_oOptions.oTypeIcons[sExtension] + '" style="vertical-align: middle;" alt="' + GForm.Language.file_selector_show_thumb + '"/></a>';
			}
			else {
				oRow.thumbpreview = '<img src="' + gThis.m_oOptions.oTypeIcons[sExtension] + '" alt=""/>';
			}
		}
		return oRow;
	};

    gThis._InitUploader = function() {
        var uploader = new plupload.Uploader({
            runtimes : 'html5',
            browse_button : gThis.GetId() + '__upload',
            container: document.getElementById(gThis.GetId() + '__queue'),
            url : gThis.m_oOptions.sUploadUrl,
            filters : {
                max_file_size : '10mb',
                mime_types: [{
                    title : "Image files",
                    extensions : "jpg,gif,png"
                }]
            },
            init: {
                FilesAdded: function(up, files) {
                    plupload.each(files, function(file) {
                        gThis.OnFileQueued(file);
                    });
                    up.start();
                },
                FileUploaded: function(up, files, response) {
                    gThis.OnUploadSuccess(files, response);
                },
                UploadProgress: function(up, file) {
                    gThis.OnUploadProgress(file);
                },

                Error: function(up, err) {
                    gThis.OnUploadProgress(err);
                },
                UploadComplete: function(){
                    gThis.OnUploadComplete();
                }
            }
        });

        uploader.init();
    };

    gThis.OnFileQueued = function(oFile) {
        if (gThis.m_iUploadsInProgress++ == 0) {
            gThis.m_iLockId = gThis.m_gForm.Lock(GForm.Language.file_selector_form_blocked, GForm.Language.file_selector_form_blocked_description);
        }
        var jLi = $('<li class="upload__' + oFile.id + '"/>');
        jLi.append('<h4>' + oFile.name + '</h4>');
        jLi.append('<p class="' + gThis._GetClass('Progress') + '"/>');
        jLi.append('<div class="' + gThis._GetClass('ProgressBar') + '"><div class="' + gThis._GetClass('ProgressBarIndicator') + '"></div>');
        gThis.m_jQueue.append(jLi);
    };

    gThis.OnDelete = function() {
        gThis.m_jSwfUpload.swfupload('cancelUpload', sFid);
    };

    gThis.OnUploadProgress = function(oFile) {
        var jLi = gThis.m_jQueue.find('.upload__' + oFile.id);
        jLi.find('.' + gThis._GetClass('Progress')).text(oFile.percent + '%');
        jLi.find('.' + gThis._GetClass('ProgressBarIndicator')).css('width', oFile.percent + '%');
    };

    gThis.OnUploadError = function(oError) {
        GAlert(GForm.Language.file_selector_upload_error, oError.message);
    };

    gThis.OnUploadSuccess = function(oFile, oResponse) {
        var jLi = gThis.m_jQueue.find('.upload__' + oFile.id);
		jLi.addClass(gThis._GetClass('UploadSuccess'));
		jLi.find('.' + gThis._GetClass('Progress')).text(GForm.Language.file_selector_upload_success);
		jLi.find('.' + gThis._GetClass('ProgressBarIndicator')).css('width', '100%');
		if (oResponse.sFilename == undefined) {
			gThis.OnUploadError(eEvent, oFile, 0, GForm.Language.localfile_processing_error);
			return;
		}
		gThis.SetValue({
			file: (gThis.m_sCWD + oResponse.sFilename).substr(gThis.m_oOptions.sFilePath.length)
		});
		gThis._RefreshFiles();
		if (gThis.m_gFilesDatagrid) {
			gThis.m_gFilesDatagrid.LoadData();
		}
		jLi.delay(2000).fadeOut(250, function() {
			$(this).remove();
		});
	};

	gThis.OnUploadComplete = function(eEvent, oFile) {
        if (--gThis.m_iUploadsInProgress <= 0) {
            gThis.m_iUploadsInProgress = 0;
            gThis.m_gForm.Unlock(gThis.m_iLockId);
        }
	};

	gThis._InitColumns = function() {

	  var column_path = new GF_Datagrid_Column({
			id: 'path',
			caption: GForm.Language.localfile_fullpath,
			appearance: {
				width: 70,
				visible: false,
				align: GF_Datagrid.ALIGN_LEFT
			}
		});
		
		var column_thumb = new GF_Datagrid_Column({
			id: 'preview',
			caption: GForm.Language.file_selector_thumb,
			appearance: {
				width: 30,
				no_title: true
			}
		});

		var column_name = new GF_Datagrid_Column({
			id: 'name',
			caption: GForm.Language.localfile_filename,
			appearance: {
				width: 150,
				align: GF_Datagrid.ALIGN_LEFT
			},
			filter: {
				type: GF_Datagrid.FILTER_INPUT
			}
		});

		var column_size = new GF_Datagrid_Column({
			id: 'size',
			appearance: {
				width: 65,
				align: GF_Datagrid.ALIGN_RIGHT
			},
			caption: GForm.Language.localfile_filesize
		});

		var column_mtime = new GF_Datagrid_Column({
			id: 'mtime',
			appearance: {
				width: 120,
				visible: false
			},
			caption: GForm.Language.localfile_filemtime
		});

		var column_owner = new GF_Datagrid_Column({
			id: 'owner',
			appearance: {
				width: 70,
				visible: false
			},
			caption: GForm.Language.localfile_fileowner
		});

		return [
			column_path,
			column_thumb,
			column_name,
			column_size,
			column_mtime,
			column_owner
		];

	};
	
	gThis._RefreshFiles = function() {
		gThis.m_oOptions.fLoadFiles({
			path: gThis.m_sCWD
		}, GCallback(gThis._OnFilesLoaded));
	};
	
	gThis._OnFilesLoaded = GEventHandler(function(eEvent) {
		if ((eEvent == undefined) || (eEvent.files == undefined) || (eEvent.cwd == undefined)) {
			return;
		}
		gThis.m_sCWD = eEvent.cwd;
		if (gThis.m_gDataProvider) {
			gThis.m_gDataProvider.ChangeData(eEvent.files);
			gThis.m_gFilesDatagrid.LoadData();
		}
	});

	gThis._Delete = function(iDg, sId) {
		var iAlertId = GWarning(GForm.Language.localfile_delete_warning, GForm.Language.localfile_delete_warning_description, {
			bAutoExpand: true,
			aoPossibilities: [
				{mLink: function() {
					GCore.StartWaiting();
					GAlert.Destroy(iAlertId);
					gThis.m_oOptions.fDeleteFile({
						file: sId
					}, GCallback(function(eEvent) {
						GCore.StopWaiting();
						var oValue = gThis.GetValue();
						if (sId == gThis.m_oOptions.sFilePath + oValue.file) {
							gThis.m_gFilesDatagrid.ClearSelection();
						}
						gThis._RefreshFiles();
					}));
				}, sCaption: GForm.Language.localfile_ok},
				{mLink: GAlert.DestroyThis, sCaption: GForm.Language.localfile_cancel}
			]
		});
	};
	
	gThis._OnDataLoaded = function(dDg) {
		dDg.m_jBody.find('.show-thumb').mouseenter(GTooltip.ShowThumbForThis).mouseleave(GTooltip.HideThumbForThis);
	};
	
	gThis._InitFilesDatagrid = function() {

		var aoColumns = gThis._InitColumns();
		
		gThis.m_gDataProvider = new GF_Datagrid_Data_Provider({
			key: 'path'
		}, []);
		
		var gActionDelete = new GF_Action({
			img: gThis._GetImage('DeleteIcon'),
			caption: GForm.Language.localfile_delete,
			action: gThis._Delete,
			condition: function(oRow) {
				return !oRow.dir;
			}
		});

    var oOptions = {
			id: gThis.GetId(),
			mechanics: {
				rows_per_page: 30,
				key: 'path',
				only_one_selected: true,
				persistent: false
			},
			event_handlers: {
				load: function(oRequest, sResponseHandler) {
					return gThis.m_gDataProvider.Load(oRequest, sResponseHandler);
				},
				loaded: gThis._OnDataLoaded,
				process: gThis._ProcessFile,
				select: gThis._OnSelect,
				deselect: gThis._OnDeselect,
				click_row: gThis._OnClickRow
			},
			row_actions: [
				gActionDelete
			],
			columns: aoColumns
    };

		gThis.m_gFilesDatagrid = new GF_Datagrid(gThis.m_jFilesDatagrid, oOptions);
		
		var oValue = gThis.GetValue();
		var sFile = oValue.file;
		if (sFile != '') {
			gThis.m_gFilesDatagrid.m_asSelected = [gThis.m_oOptions.sFilePath + sFile];
		}
		
		gThis._RefreshFiles();
	};
	
}, oDefaults);