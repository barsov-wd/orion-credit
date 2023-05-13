'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // range, calc

    // маска
    function prettify(num) {
        var n = num.toString();
        return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
    }

    // вычисление платежа
    function getPayment(sum, period, rate) {
        // *
        // * sum - сумма кредита
        // * period - срок в годах
        // * rate - годовая ставка в процентах
        // *
        let i,
            koef,
            payment;

        // ставка в месяц
        i = (rate / 12) / 100;

        // коэффициент аннуитета
        koef = (i * (Math.pow(1 + i, period * 12))) / (Math.pow(1 + i, period * 12) - 1);

        // итог
        payment = (sum * koef).toFixed();
        return prettify(payment);
    };

    function correctWordYear(val) {
        switch (val) {
            case 1:
                return 'год'
            case 2:
                return 'года'
            case 3:
                return 'года'
            case 4:
                return 'года'
            default:
                return 'лет'
        }
    }

    function range(rangeInputSum_, rangeTrackSum_, rangeInputTerm_, rangeTrackTerm_, inputSum_, inputTerm_, resultField, textYear_) {
        const rangeInputSum = document.querySelector(rangeInputSum_),
            rangeTrackSum = document.querySelector(rangeTrackSum_),
            rangeInputTerm = document.querySelector(rangeInputTerm_),
            rangeTrackTerm = document.querySelector(rangeTrackTerm_),
            inputSum = document.querySelector(inputSum_),
            inputTerm = document.querySelector(inputTerm_),
            result = document.querySelector(resultField),
            textYear = document.querySelector(textYear_);


        let minSum = +rangeInputSum.getAttribute('min'),
            maxSum = +rangeInputSum.getAttribute('max'),
            stepSum = +rangeInputSum.getAttribute('step'),
            minTerm = +rangeInputTerm.getAttribute('min'),
            maxTerm = +rangeInputTerm.getAttribute('max'),
            stepTerm = +rangeInputTerm.getAttribute('step');

        rangeInputSum.addEventListener('input', function () {
            let position = 100 / (maxSum - stepSum) * (this.value - stepSum);

            rangeTrackSum.style.width = `${position}%`;
            inputSum.value = prettify(this.value);

            if (inputTerm.value < minTerm) {
                result.textContent = '-'
                return
            }

            result.textContent = getPayment(this.value, rangeInputTerm.value, 4) + ' ₽'
        });

        rangeInputTerm.addEventListener('input', function () {
            let position = 100 / (maxTerm - stepTerm) * (this.value - stepTerm);

            rangeTrackTerm.style.width = `${position}%`;
            inputTerm.value = this.value;
            textYear.textContent = correctWordYear(+this.value)

            if (inputSum.value.replace(/\D/g, '') < minSum) {
                result.textContent = '-'
                return
            }

            result.textContent = getPayment(rangeInputSum.value, this.value, 4) + ' ₽'
        });

        inputSum.addEventListener('input', function () {
            this.value = prettify(this.value.replace(/\D/g, ''))
            if (this.value.replace(/\D/g, '') > maxSum) {
                this.value = prettify(maxSum)
            }
            if (this.value.replace(/\D/g, '') < minSum) {
                rangeInputSum.value = 0
                result.textContent = '-'
                rangeTrackSum.style.width = 0 + '%'
                return
            }
            if (this.value.replace(/\D/g, '') >= minSum && this.value.replace(/\D/g, '') <= maxSum) {
                rangeTrackSum.style.width = `${100 / (maxSum - stepSum) * (this.value.replace(/\D/g, '') - stepSum)}%`;
                rangeInputSum.value = this.value.replace(/\D/g, '')
            }
            if (inputTerm.value < minTerm) {
                result.textContent = '-'
                return
            }
            result.textContent = getPayment(rangeInputSum.value, rangeInputTerm.value, 4) + ' ₽'
        })

        inputTerm.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '')
            if (this.value > maxTerm) {
                this.value = maxTerm
            }
            if (this.value < minTerm) {
                rangeInputTerm.value = 0
                result.textContent = '-'
                rangeTrackTerm.style.width = 0 + '%'
                return
            }
            if (this.value >= minTerm && this.value <= maxTerm) {
                rangeTrackTerm.style.width = `${100 / (maxTerm - stepTerm) * (this.value - stepTerm)}%`;
                rangeInputTerm.value = this.value
                rangeInputTerm.value = this.value
                textYear.textContent = correctWordYear(+this.value)
            }
            if (inputSum.value.replace(/\D/g, '') < minSum) {
                result.textContent = '-'
                return
            }
            result.textContent = getPayment(rangeInputSum.value, rangeInputTerm.value, 4) + ' ₽'
        })
    }

    range(".calc__range__input--1", ".calc__range__track--1", ".calc__range__input--2", ".calc__range__track--2", ".calc__field--1", ".calc__field--2", '.calc__content-result-title--res', ".calc__field__text--year");


    // функция для модалки

    function calcScroll() {
        let div = document.createElement('div');

        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';

        document.body.appendChild(div);
        let scarollWidth = div.offsetWidth - div.clientWidth;
        div.remove();

        return scarollWidth;
    }

    let scrollWidth = calcScroll();

    function modal(modal, modalActiveClass, triggers, modalClose) {
        const triggers_ = document.querySelectorAll(triggers),
            modal_ = document.querySelector(modal),
            modalClose_ = document.querySelector(modalClose);

        if (triggers_.length > 0) {
            triggers_.forEach(item => {
                item.addEventListener('click', () => {
                    modal_.classList.add(modalActiveClass);
                    document.body.style.overflow = 'hidden';
                    document.body.style.marginRight = `${scrollWidth}px`;
                });
            });

            modalClose_.addEventListener('click', () => {
                modal_.classList.remove(modalActiveClass);
                document.body.style.overflow = '';
                document.body.style.marginRight = '0px';
            });

            modal_.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__container')) {
                    modal_.classList.remove(modalActiveClass);
                    document.body.style.overflow = '';
                    document.body.style.marginRight = '0px';
                }
            });
        }
    }

    modal('.modal-main', 'modal--active', '[data-modal]', '.modal-main__close');


    //faq

    function faq(title, itemActive) {

        const titles = document.querySelectorAll(title);

        titles.forEach((item) => {
            item.addEventListener('click', () => {
                item.parentElement.classList.toggle(itemActive);

            });
        });

    }

    faq('.faq__item__title', 'faq__item--active');
});