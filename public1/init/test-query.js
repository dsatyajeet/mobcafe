/**
 * test-query
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

isd.aggregate([
    {
        $group: {
            _id: '$region',  //$region is the column name in collection
            count: {$sum: 1}
        }
    }
], function (err, result) {
    if (err) {
        next(err);
    } else {
        res.json(result);
    }
});