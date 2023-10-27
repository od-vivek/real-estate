const e = require('express');
const Listing = require('../models/Listing');
const { errorHandler } = require('../utils/error');

exports.createListing = async (req, res, next) => {
    try {
        // Check if the user is authenticated
        if (!req.user) {
            return next(errorHandler(401, 'You must be authenticated to create a listing.'));
        }

        // Create the listing with the authenticated user's ID
        const listingData = {
            ...req.body,
            userRef: req.user.id, // Assuming you have a user ID in req.user
        };

        const listing = await Listing.create(listingData);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

exports.deleteListing = async (req, res, next) => {
    try {
        // Check if the listing exists
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }

        // Check if the user is authorized to delete the listing
        if (req.user.id !== String(listing.userRef)) { // Ensure the user ID and userRef are compared correctly
            return next(errorHandler(401, 'You can only delete your own listing!'));
        }

        // If all checks pass, delete the listing
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error);
    }
}

exports.updateListing = async (req, res, next) => {
    try {
        // Check if the listing exists
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }

        // Check if the user is authorized to update the listing
        if (req.user.id !== String(listing.userRef)) {
            return next(errorHandler(401, 'Unauthorized! You can only update your own listing.'));
        }

        // Update the listing with the request body
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body, // Change req.params.body to req.body to get the request body
            { new: true } // Return the updated document
        );

        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}

exports.getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        res.status(200).json(listing);
    } catch (error) {
        return next(error);
    }
}

exports.getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};