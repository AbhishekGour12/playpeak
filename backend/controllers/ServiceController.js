import Service from '../models/Service.js';

// @desc    Get all services (auto-seeds if empty)
// @route   GET /api/services
// @access  Public
export const getAllServices = async (req, res) => {
    try {
        let services = await Service.find({});

        // Seed initial services if database is empty
        if (services.length === 0) {
            const seedServices = [
                {
                    title: 'Digital Catalog Access',
                    description: 'Browse our extensive collection of physical and digital resources.',
                    icon: 'FiBook',
                    features: ['100,000+ titles', 'AI-powered search', 'Personalized recommendations', '24/7 access']
                },
                {
                    title: 'Study Room Booking',
                    description: 'Reserve private study spaces with smart time management.',
                    icon: 'FiUsers',
                    features: ['QR check-in system', 'Flexible time slots', 'Group collaboration spaces', 'Resource integration']
                },
                {
                    title: 'High Speed Wi-Fi & Labs',
                    description: 'Access ultra high-speed internet and modern digital labs.',
                    icon: 'FiClock',
                    features: ['Gigabit internet access', 'Specialized coding software', 'Access to power slots', 'Technical support']
                },
                {
                    title: 'Membership Plans',
                    description: 'Flexible pricing options for students, individuals, and researchers.',
                    icon: 'FiDollarSign',
                    features: ['Student discounts', 'Extended hours', 'Seat reservation rights', 'Quiet zone access']
                }
            ];

            await Service.insertMany(seedServices);
            services = await Service.find({});
        }

        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new library service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
    const { title, description, icon, features } = req.body;

    try {
        const service = new Service({
            title,
            description,
            icon: icon || 'FiBook',
            features: features || []
        });

        const createdService = await service.save();
        res.status(201).json({ success: true, data: createdService });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error creating service', error: error.message });
    }
};

// @desc    Update a library service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            service.title = req.body.title || service.title;
            service.description = req.body.description || service.description;
            service.icon = req.body.icon || service.icon;
            service.features = req.body.features || service.features;

            const updatedService = await service.save();
            res.json({ success: true, data: updatedService });
        } else {
            res.status(404).json({ success: false, message: 'Service not found' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error updating service', error: error.message });
    }
};

// @desc    Delete a library service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            await service.deleteOne();
            res.json({ success: true, message: 'Service removed successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
