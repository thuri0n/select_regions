import $ from 'Jquery';
import './style.less';
// Your code...

export default class CitySelector {
    constructor(data) {
        this.elementId = data.elementId;
        this.jqElementId = $('#' + data.elementId);
        this.localitiesUrl = data.localitiesUrl;
        this.regionsUrl = data.regionsUrl;
        this.saveUrl = data.saveUrl;
        this.infoBLock = $('#info');
        this.createComponentBtn = '#createCitySelector';
        this.destroyComponentBtn = '#destroyCitySelector';
        this.state = {};

        $(document).on('click', this.createComponentBtn, () => {
            this.createComponent();
        });

        $(document).on('click', this.destroyComponentBtn, () => {
            this.destroyComponent();
        });

        this.jqElementId.on('click', '#selectRegion', () => {
            this.loadRegions();
        });

        this.jqElementId.on('click', '#saveCitySelector', () => {
            this.saveData(this.saveUrl, this.state);
        });

        this.jqElementId.on('click', '.o-region__list', (el) => {
            this.toggleActiveClass(el.currentTarget);
            this.loadLocalities(el);
        });

        this.jqElementId.on('click', '.o-localities__list', (el) => {
            this.toggleActiveClass(el.currentTarget);
            this.localities(el);
        });
    }

    createComponent() {
        this.visibleInfoBlock(true);
        $('#' + this.elementId).html('<button id="selectRegion">Выбрать регион</button>');
    }

    destroyComponent() {
        this.visibleInfoBlock(false);
        this.appendInfo({});
        this.jqElementId.html('');
    }

    visibleInfoBlock(bool) {
        return bool ? this.infoBLock.show() : this.infoBLock.hide();
    }

    toggleActiveClass(el) {
        $(el).addClass('active').siblings().removeClass('active');
    }

    loadRegions() {
        $.getJSON(this.regionsUrl, () => {
            this.jqElementId.html('<div class="o-region"></div>');
        }).then((data) => {
            const items = [];
            for (let i = 0; i < data.length; i++) {
                items.push('<div class="o-region__list" id="' + data[i].id + '">' + data[i].title + '</div>');
            }
            $('.o-region').html(items.join(''));
        });
    }

    loadLocalities(ev) {
        const currentId = ev.currentTarget.id;
        if(currentId !== this.state.region) {
            $.getJSON(this.localitiesUrl + '/' + currentId, () => {
                if (!$('#' + this.elementId + ' .o-localities').length)
                    $('<div class="o-localities"></div>').insertAfter('#' + this.elementId + ' .o-region');
            }).then((data) => {
                const items = [];
                for (let i = 0; i < data.list.length; i++) {
                    items.push('<div class="o-localities__list">' + data.list[i] + '</div>');
                }
                $('.o-localities').html(items.join(''));
            }).then(() => {
                this.appendInfo(this.state);
            });
        }
        this.state = {
            region: currentId
        };
    }

    appendInfo(obj) {
        if(obj.region) {
            $('#regionText').text(obj.region);
        } else {
            $('#regionText').text('');
        }
        if(obj.locality) {
            $('#localityText').text(obj.locality);
        } else {
            $('#localityText').text('');
        }

        this.showSaveBtn();
    }

    localities(ev) {
        this.state.locality = $(ev.currentTarget).text();
        this.appendInfo(this.state);
    }

    showSaveBtn() {
        const stateBtn = '<div class="o-save"><button id="saveCitySelector" ' + (this.state.locality ? '' : 'disabled') +' >Сохранить</button></div>',
            el = $('#' + this.elementId + ' .o-save');
        if(!el.length) {
            $('<div class="o-save"></div>').insertAfter('#' + this.elementId + ' .o-localities');
        } else {
            el.html(stateBtn);
        }
    }

    saveData(url, obj) {
        $.ajax({
            url: url,
            method: 'POST',
            async: false,
            data: obj
        }).done(function () {
            $(location).attr('href', url);
        });
    }
}
