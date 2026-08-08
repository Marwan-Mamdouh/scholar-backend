import db from "../../db/db_config.js"
import { Prisma } from "@prisma/client";
import type { PaginationQuery } from "../../middlewares/pagination.js";
import type { domainSchema, publicationEditorialStatsID, publicationFilterInput, domain, domainFilter, subCategory, subCategoryFilter, publication, publicationID, publicationPatch, publicationMetrics, publicationMetricsID, publicationMetricsPatch, PublicationEditorialStat, PublicationEditorialStatPatch, PublicationPricing, PublicationPricingPatch } from "./publication.schema.js";

const publicationService = {
    async addDomain( doaminData: domain ){
        try {
            const newDomain = await db
                .publicationDomain
                .create({data: doaminData });
            return newDomain;
        } catch (error) {
            if (error) {
                console.error("PublicationDomain DB Error:", error.message);
                throw new Error("error adding Publication Domain.");
            }
        }
    },

    async getAllDomains(){
        try {
            const allDomains = await db
                .publicationDomain
                .findMany({
                    include:{subCategories:true}
                });
            console.log("Publication Domains:", allDomains);
            return allDomains || [];
        } catch (error) {
            if (error) throw error;
        }
    },

    async removeDomain( doaminData: domainFilter ){
        try {
            const removedDomain = await db
                .publicationDomain
                .delete({
                    where:{id:doaminData.id}
                })            
        } catch (error) {
            if (error) {
                console.error("PublicationDomain DB Error:", error.message);
                throw new Error("error removing Publication Domain.");
            }
        }

    },


    async addSubCategory( subCategoryData: subCategory ){
        try {
            const found = await db
                .publicationDomain
                .findUnique({
                    where:{id:subCategoryData.domainId}
                })
    
            if (!found) {
                console.error("Invalid data Error:", "domainId isn't found in db");
                throw new Error("Error adding Publication subCategory: domainId not found.");
            }
            
            const newSubcategory = await db
                .publicationSubCategory
                .create({data:subCategoryData})
            return newSubcategory;
        } catch (error) {
            if (error) {
                console.error("publicationSubcategories DB Error:", error.message);
                throw new Error("error adding Publication subCategory.");
            }
        }    
    },

    async getAllSubcategories(){
        try {
            const allSubcategories = await db
                .publicationSubCategory
                .findMany({
                    include:{domain: true}
                })
                console.log("publication Subcategories:", allSubcategories);
                return allSubcategories || [];
        } catch (error) {
            if (error) throw error;
        }
    },


    async removesubCategory( subCategoryData: subCategoryFilter ){
        try {
            const removedSubCategory = await db
                .publicationSubCategory
                .delete({where:{id:subCategoryData.id}})
        } catch (error) {
            if (error) {
                console.error("publicationSubcategories DB Error:", error.message);
                throw new Error("error removing Publication subCategory.");
            }         
        }
    },

    async addPublication( publicationData: publication ){
        try {
            const found = await db
                .publicationSubCategory
                .findUnique({
                    where:{id:publicationData.subCategoryId}
                })
            
            if (!found) {
                console.error("Invalid data Error:", "subCategory isn't found in db");
                throw new Error("Error adding Publication: subCategory not found.");
            }
    
            const newPublication = await db
                .academicPublication
                .create({data:publicationData})
            return newPublication;
        } catch (error) {
            if (error) {
                console.error("academicPublications DB Error:", error.message);
                throw new Error("error adding Publication.");
            }            
        }    
    },
    
    async getPublicationFiltered( filterData: publicationFilterInput ){
        try {
            const { 
            categories, 
            publishingModel, 
            licensing, 
            pricing, 
            metrics, 
            editorialSpeed, 
            } = filterData;

            // Dynamically build Prisma where input
            const where: Prisma.AcademicPublicationWhereInput = {};

            // 1. Filter by SubCategory / Category IDs
            if (categories?.categoryIds?.length) {
            where.subCategoryId = { in: categories.categoryIds };
            }

            // 2. Filter by Open Access / Publishing Model
            if (publishingModel?.length) {
            where.openAccessType = { in: publishingModel };
            }

            // 3. Filter by License Type
            if (licensing?.length) {
            where.licenseType = { in: licensing };
            }

            // 4. Max Article Fee (APC) + Currency + Year
            if (pricing?.maxCost !== undefined || pricing?.currency) {
            where.pricings = {
                some: {
                ...(pricing.currency && { currency: pricing.currency }),
                // ...(pricing.year && { pricingYear: pricing.year }),
                ...(pricing.maxCost !== undefined && { cost: { lte: pricing.maxCost } }),
                },
            };
            }

            // 5. Yearly Metrics (Impact Factor, SJR, CiteScore, Quartile)
            if (metrics) {
            const metricFilters: Prisma.PublicationYearlyMetricWhereInput = {};

            // if (metrics.year) metricFilters.metricYear = metrics.year;
            if (metrics.quartiles?.length) metricFilters.quartile = { in: metrics.quartiles };

            if (metrics.impactFactor) {
                metricFilters.impactFactor = {
                ...(metrics.impactFactor.min !== undefined && { gte: metrics.impactFactor.min }),
                ...(metrics.impactFactor.max !== undefined && { lte: metrics.impactFactor.max }),
                };
            }

            if (metrics.sjr) {
                metricFilters.sjr = {
                ...(metrics.sjr.min !== undefined && { gte: metrics.sjr.min }),
                ...(metrics.sjr.max !== undefined && { lte: metrics.sjr.max }),
                };
            }

            if (metrics.citeScore) {
                metricFilters.citescore = {
                ...(metrics.citeScore.min !== undefined && { gte: metrics.citeScore.min }),
                ...(metrics.citeScore.max !== undefined && { lte: metrics.citeScore.max }),
                };
            }

            where.yearlyMetrics = { some: metricFilters };
            }

            // 6. Editorial Speed & Acceptance Rate (Convert UI Weeks -> DB Days)
            if (editorialSpeed) {
            const speedFilters: Prisma.PublicationEditorialStatWhereInput = {};

            if (editorialSpeed.firstDecisionWeeks) {
                speedFilters.submissionToFirstDecision = {
                ...(editorialSpeed.firstDecisionWeeks.min !== undefined && { gte: editorialSpeed.firstDecisionWeeks.min * 7 }),
                ...(editorialSpeed.firstDecisionWeeks.max !== undefined && { lte: editorialSpeed.firstDecisionWeeks.max * 7 }),
                };
            }

            if (editorialSpeed.submissionToAcceptanceWeeks) {
                speedFilters.submissionToAcceptance = {
                ...(editorialSpeed.submissionToAcceptanceWeeks.min !== undefined && { gte: editorialSpeed.submissionToAcceptanceWeeks.min * 7 }),
                ...(editorialSpeed.submissionToAcceptanceWeeks.max !== undefined && { lte: editorialSpeed.submissionToAcceptanceWeeks.max * 7 }),
                };
            }

            // if (editorialSpeed.acceptanceRatePercent) {
            //     speedFilters.acceptanceRate = {
            //     ...(editorialSpeed.acceptanceRatePercent.min !== undefined && { gte: editorialSpeed.acceptanceRatePercent.min }),
            //     ...(editorialSpeed.acceptanceRatePercent.max !== undefined && { lte: editorialSpeed.acceptanceRatePercent.max }),
            //     };
            // }

            where.editorialStats = { some: speedFilters };
            }

            // Execute query and total count in parallel
            const [total, publications] = await Promise.all([
            db.academicPublication.count({ where }),
            db.academicPublication.findMany({
                where,
                include: {
                yearlyMetrics: {
                    take: 1,
                    orderBy: { metricYear: 'desc' },
                },
                subCategory: {
                    include: {
                    domain: true,
                    },
                },
                pricings: true,
                editorialStats: true,
                },
            }),
            ]);

            console.log("Found publications count:", total);

            return {
                publications: publications || [],
            };
        } catch (error) {
            if (error) throw error;
        }
    },

    
    async getFilterRanges() {
        try {
            // Run aggregates on both tables in parallel
            const [metricStats, editorialStats] = await Promise.all([
            db.publicationYearlyMetric.aggregate({
                _min: {
                impactFactor: true,
                sjr: true,
                citescore: true,
                },
                _max: {
                impactFactor: true,
                sjr: true,
                citescore: true,
                },
            }),
            db.publicationEditorialStat.aggregate({
                _min: {
                submissionToFirstDecision: true,
                submissionToAcceptance: true,
                },
                _max: {
                submissionToFirstDecision: true,
                submissionToAcceptance: true,
                },
            }),
        ]);

    // Helpers to cast Prisma Decimal/null values and convert Days -> Weeks
            const toNumber = (val: any) => (val !== null && val !== undefined ? Number(val) : 0);
            const daysToWeeks = (days: any) => (days !== null && days !== undefined ? Number((Number(days) / 7).toFixed(1)) : 0);

            return {
            impactFactor: {
                min: toNumber(metricStats._min.impactFactor),
                max: toNumber(metricStats._max.impactFactor),
            },
            sjr: {
                min: toNumber(metricStats._min.sjr),
                max: toNumber(metricStats._max.sjr),
            },
            citeScore: {
                min: toNumber(metricStats._min.citescore),
                max: toNumber(metricStats._max.citescore),
            },
            firstDecisionWeeks: {
                min: daysToWeeks(editorialStats._min.submissionToFirstDecision),
                max: daysToWeeks(editorialStats._max.submissionToFirstDecision),
            },
            submissionToAcceptanceWeeks: {
                min: daysToWeeks(editorialStats._min.submissionToAcceptance),
                max: daysToWeeks(editorialStats._max.submissionToAcceptance),
            },
            };
        } catch (error) {
            if (error) throw error;
        }
    },
    
    async getAllPublication(){
        try {
            const allPublication = await db
                .academicPublication
                .findMany({
                    include:{
                        yearlyMetrics:true,
                        subCategory:{
                            include:{
                                domain:true
                            }
                        }
                    }
                })
                console.log("publications:", allPublication);
                return allPublication || [];
        } catch (error) {
            if (error) throw error;
        }
    },

    async getPublication(publicationData:publicationID){
        try {
            const publication = await db
                .academicPublication
                .findUnique({
                    where:{id:publicationData.id},
                    include:{
                        yearlyMetrics:true,
                        subCategory:{
                            include:{
                                domain:true
                            }
                        }
                    }
                })
            console.log("publications:", publication);
            return publication || {};
        } catch (error) {
            if (error) throw error;
        }
    },

    async patchPublication( publicationData: publicationPatch ){
        try {
            if(publicationData.subCategoryId){
                const found = await db
                    .publicationSubCategory
                    .findUnique({
                        where:{id:publicationData.subCategoryId}
                    })
                
                if (!found) {
                    console.error("Invalid data Error:", "subCategory isn't found in db");
                    throw new Error("Error adding Publication: subCategory not found.");
                }
            }
            const patchedPublication = await db
                .academicPublication
                .update({
                    where:{id:publicationData.id},
                    data:publicationData
                })
            return patchedPublication;
        } catch (error) {
            if (error) {
                console.error("academicPublications DB Error:", error.message);
                throw new Error("error adding Publication.");
            }            
        }    
    },
    
    async removePublication( publicationData: publicationID ){
        try {
            const removedPublication = await db.$transaction([
                db.publicationYearlyMetric
                    .deleteMany({
                        where:{publicationId:publicationData.id}
                    }),
                db.publicationEditorialStat
                    .deleteMany({
                        where:{publicationId:publicationData.id}
                    }),
                db.publicationPricing
                    .deleteMany({
                        where:{publicationId:publicationData.id}
                    }),
                db.academicPublication
                    .delete({
                        where:{id:publicationData.id}
                    })            
            ])
        } catch (error) {
            if (error) {
                console.error("Publication DB Error:", error.message);
                throw new Error("error removing Publication.");
            }
        }
    },
//! ////////////////////////////
    async addMetrics( metricsData: publicationMetrics ){
        try {
            const found = await db
                .academicPublication
                .findUnique({
                    where:{id:metricsData.publicationId}
                })
            
            if (!found) {
                console.error("Invalid data Error:", "Publication isn't found in db");
                throw new Error("Error adding metrics: subCategory not found.");
            }
    
            const newPublicationMetrics = await db
                .publicationYearlyMetric
                .create({data:metricsData})
            return newPublicationMetrics
        } catch (error) {
            if (error) {
                console.error("publicationYearlyMetric DB Error:", error.message);
                throw new Error("error adding metrics.");
            }            
        }    
    },
    
    async getMetrics( metricsData:publicationMetricsID ){
        try {
            const metrics = await db
                .publicationYearlyMetric
                .findUnique({
                    where:{id:metricsData.id},
                    include:{
                        publication:{
                            include:{
                                subCategory:{
                                    include:{
                                        domain:true
                                    }
                                }
                            }
                        }
                    }
                })
                console.log("publication metrics:", metrics);
                return metrics || {};
        } catch (error) {
            if (error) throw error;
        }
    },

    async patchMetrics( metricsData: publicationMetricsPatch ){
        try {
            if(metricsData.publicationId){
                const found = await db
                    .academicPublication
                    .findUnique({
                        where:{id:metricsData.publicationId}
                    })
                
                if (!found) {
                    console.error("Invalid data Error:", "Publication isn't found in db");
                    throw new Error("Error editing metric: Publication not found.");
                }
            }
            const patchedMetrics = await db
                .publicationYearlyMetric
                .update({
                    where:{id:metricsData.id},
                    data:metricsData
                })
            return patchedMetrics;
        } catch (error) {
            if (error) {
                console.error("publicationYearlyMetric DB Error:", error.message);
                throw new Error("error patching Publication metrics.");
            }            
        }    
    },
    
    async removeMetrics( metricsData: publicationMetricsID ){
        try {
            const removedMetrics = await db
                .publicationYearlyMetric
                .delete({
                    where:{id:metricsData.id}
                })
        } catch (error) {
            if (error) {
                console.error("publicationYearlyMetric DB Error:", error.message);
                throw new Error("error removing Publication Metric.");
            }
        }
    },
//! //////////////////////////
    async addEditorialStats( editorialStatsData: PublicationEditorialStat ){
        try {
            const found = await db
                .academicPublication
                .findUnique({
                    where:{id:editorialStatsData.publicationId}
                })
            
            if (!found) {
                console.error("Invalid data Error:", "Publication isn't found in db");
                throw new Error("Error adding metrics: subCategory not found.");
            }
    
            const newPublicationEitorialStats = await db
                .publicationEditorialStat
                .create({
                    data: editorialStatsData
                })
            return newPublicationEitorialStats
        } catch (error) {
            if (error) {
                console.error("PublicationEitorialStats DB Error:", error.message);
                throw new Error("error adding EitorialStats.");
            }            
        }    
    },
    
    async getEditorialStats( editorialStatsData:publicationEditorialStatsID ){
        try {
            const metrics = await db
                .publicationYearlyMetric
                .findUnique({
                    where:{id:editorialStatsData.id},
                    include:{
                        publication:{
                            include:{
                                subCategory:{
                                    include:{
                                        domain:true
                                    }
                                }
                            }
                        }
                    }
                })
                console.log("publication metrics:", metrics);
                return metrics || {};
        } catch (error) {
            if (error) throw error;
        }
    },

    async patchEditorialStat( editorialStatsData: PublicationEditorialStatPatch ){
        try {
            if(editorialStatsData.publicationId){
                const found = await db
                    .academicPublication
                    .findUnique({
                        where:{id:editorialStatsData.publicationId}
                    })
                
                if (!found) {
                    console.error("Invalid data Error:", "Publication isn't found in db");
                    throw new Error("Error editing metric: Publication not found.");
                }
            }
            const patchedEditorialStats = await db
                .publicationEditorialStat
                .update({
                    where:{id:editorialStatsData.id},
                    data:editorialStatsData
                })
            return patchedEditorialStats;
        } catch (error) {
            if (error) {
                console.error("publicationEditorialStat DB Error:", error.message);
                throw new Error("error patching Publication Editorial Stat.");
            }            
        }    
    },
    
    async removeEditorialStat( editorialStatsData: publicationEditorialStatsID ){
        try {
            const removedEditorialStat = await db
                .publicationEditorialStat
                .delete({
                    where:{id:editorialStatsData.id}
                })
        } catch (error) {
            if (error) {
                console.error("publicationEditorialStat DB Error:", error.message);
                throw new Error("error removing Publication Editorial Stat.");
            }
        }
    },
//! //////////////////////////
    async addPricing( pricingData: PublicationPricing ){
        try {
            const found = await db
                .academicPublication
                .findUnique({
                    where:{id:pricingData.publicationId}
                })
            
            if (!found) {
                console.error("Invalid data Error:", "Publication isn't found in db");
                throw new Error("Error adding pricing: publication not found.");
            }
    
            const newPricing = await db
                .publicationPricing
                .create({
                    data: {
                        pricingYear: pricingData.pricingYear,
                        cost: pricingData.cost,
                        isSubscription: pricingData.isSubscription,
                        currency: pricingData.currency,
                        publicationId: pricingData.publicationId
                        }
                    }
                )
            return newPricing
        } catch (error) {
            if (error) {
                console.error("PublicationPricing DB Error:", error.message);
                throw new Error("error adding publication pricing.");
            }            
        }    
    },
    
    async getPricing( pricingData:publicationID ){
        try {
            const pricing = await db
                .publicationPricing
                .findUnique({
                    where:{id:pricingData.id},
                    include:{
                        publication:{
                            include:{
                                subCategory:{
                                    include:{
                                        domain:true
                                    }
                                }
                            }
                        }
                    }
                })
                console.log("publication pricing:", pricing);
                return pricing || {};
        } catch (error) {
            if (error) throw error;
        }
    },

    async patchPricing( pricingData: PublicationPricingPatch ){
        try {
            if(pricingData.publicationId){
                const found = await db
                    .academicPublication
                    .findUnique({
                        where:{id:pricingData.publicationId}
                    })
                
                if (!found) {
                    console.error("Invalid data Error:", "Publication isn't found in db");
                    throw new Error("Error editing metric: Publication not found.");
                }
            }
            const patchedPricing = await db
                .publicationPricing
                .update({
                    where:{id:pricingData.id},
                    data:pricingData
                })
            return patchedPricing;
        } catch (error) {
            if (error) {
                console.error("publicationPricing DB Error:", error.message);
                throw new Error("error patching Publication Pricing.");
            }            
        }    
    },
    
    async removePricing( pricingData: publicationID ){
        try {
            const removedPricing = await db
                .publicationPricing
                .delete({
                    where:{id:pricingData.id}
                })
        } catch (error) {
            if (error) {
                console.error("publicationPricing DB Error:", error.message);
                throw new Error("error removing Publication Pricing.");
            }
        }
    },

};

export default publicationService;