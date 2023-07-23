/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    __, allPass, andThen, assoc, compose, concat, gt, ifElse, length, lt, mathMod, otherwise, 
    partial, prop, tap, test
} from "ramda";

const api = new Api();

const squareNum = x => x ** 2;
const checkGreaterThanTwo = gt(__, 2);
const checkLessThanTen = lt(__, 10);
const convertStringToNumber = compose(Math.round, Number);

const validateLengthMoreThanTwo = compose(checkGreaterThanTwo, length);
const validateLengthLessThanTen = compose(checkLessThanTen, length);
const isNumericString = test(/^[0-9]+\.?[0-9]+$/);
const modByThreeAndToString = compose(String, mathMod(__, 3));

const BASE_NUM_URL = 'https://api.tech/numbers/base';
const ANIMALS_API_URL = 'https://animals.tech/';
const extractResult = compose(String, prop('result'));

const assocToBinary = assoc('number', __, { from: 10, to: 2 });
const getBinaryFromApi = compose(api.get(BASE_NUM_URL), assocToBinary);

const isValid = allPass([validateLengthMoreThanTwo, validateLengthLessThanTen, isNumericString]);

const executeSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const logAction = tap(writeLog);
    const onSuccess = andThen(handleSuccess);
    const onError = otherwise(handleError);

    const validationError = partial(handleError, ['ValidationError']);

    const coreSequence = compose(
        onError,
        onSuccess,
        andThen(extractResult),
        andThen(api.get(__, {})),
        andThen(concat(ANIMALS_API_URL)),
        andThen(modByThreeAndToString),
        andThen(squareNum),
        andThen(length),
        andThen(extractResult),
        getBinaryFromApi,
        logAction,
        convertStringToNumber
    );

    const conditionalRun = ifElse(isValid, coreSequence, validationError);
    const startSequence = compose(conditionalRun, logAction);

    startSequence(value);
};

export default executeSequence;

