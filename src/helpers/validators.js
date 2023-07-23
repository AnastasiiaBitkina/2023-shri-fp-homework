import { filter, equals, prop, values, compose, length, countBy, identity, allPass, anyPass, gte } from 'ramda';

const isColor = color => propColor => compose(equals(color), prop(propColor));
const countColor = color => compose(length, filter(equals(color)), values);

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = obj => allPass([
    isColor('red')('star'),
    isColor('green')('square'),
    () => equals(2, countColor('white')(obj))
])(obj);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = obj => gte(countColor('green')(obj), 2);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = obj => equals(countColor('red')(obj), countColor('blue')(obj));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    isColor('red')('star'),
    isColor('orange')('square'),
    isColor('blue')('circle')
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = obj => {
    const counts = countBy(identity, values(obj));
    const predicates = Object.keys(counts).map(color => {
        if (color !== 'white' && counts[color] >= 3) {
            return () => true;
        }
        return () => false;
    });
    return anyPass(predicates)(obj);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = obj => allPass([
    () => equals(2, countColor('green')(obj)),
    () => equals(1, countColor('red')(obj)),
    isColor('green')('triangle')
])(obj);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(equals(4), countColor('orange'));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = obj => {
    const starColor = prop('star', obj);
    return !equals(starColor, 'red') && !equals(starColor, 'white');
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(equals(4), countColor('green'));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    obj => equals(prop('triangle', obj), prop('square', obj)),
    obj => !equals('white', prop('triangle', obj))
]);