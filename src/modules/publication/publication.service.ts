import { db } from "../../db/db_config.js"
import { Prisma } from "@prisma/client";
import type { PaginationMeta } from "../../utils/pagination.util.js";
import { buildPaginatedResponse } from "../../utils/pagination.util.js";
import type { domainSchema, publicationEditorialStatsID, publicationSearchQuery, domain, domainFilter, subCategory, subCategoryFilter, publication, publicationID, publicationPatch, publicationMetrics, publicationMetricsID, publicationMetricsPatch, PublicationEditorialStat, PublicationEditorialStatPatch, PublicationPricing, PublicationPricingPatch } from "./publication.schema.js";

const publicationService = {
    async addDomain( domainData: domain ){
        try {
            const newDomain = await db
                .publicationDomain
                .create({data: domainData });
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

    async removeDomain( domainData: domainFilter ){
        try {
            const removedDomain = await db
                .publicationDomain
                .delete({
                    where:{id:domainData.id}
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
    
    async searchPublications( query: publicationSearchQuery, pagination: PaginationMeta ){
        try {
            // 1. Build the Prisma where input from the flattened query params
            const where: Prisma.AcademicPublicationWhereInput = {};

            // 1a. SubCategory / Category IDs
            if (query.categoryIds?.length) {
                where.subCategoryId = { in: query.categoryIds };
            }

            // 1b. Open Access / Publishing Model
            if (query.publishingModel?.length) {
                where.openAccessType = { in: query.publishingModel };
            }

            // 1c. License Type
            if (query.licensing?.length) {
                where.licenseType = { in: query.licensing };
            }

            // 1d. Max Article Fee (APC) + Currency
            if (query.maxCost !== undefined || query.currency) {
                where.pricings = {
                    some: {
                        ...(query.currency && { currency: query.currency }),
                        ...(query.maxCost !== undefined && { cost: { lte: query.maxCost } }),
                    },
                };
            }

            // 1e. Yearly Metrics (Impact Factor, SJR, CiteScore, Quartile)
            const metricFilters: Prisma.PublicationYearlyMetricWhereInput = {};

            if (query.quartiles?.length) metricFilters.quartile = { in: query.quartiles };

            if (query.impactFactorMin !== undefined || query.impactFactorMax !== undefined) {
                metricFilters.impactFactor = {
                    ...(query.impactFactorMin !== undefined && { gte: query.impactFactorMin }),
                    ...(query.impactFactorMax !== undefined && { lte: query.impactFactorMax }),
                };
            }

            if (query.sjrMin !== undefined || query.sjrMax !== undefined) {
                metricFilters.sjr = {
                    ...(query.sjrMin !== undefined && { gte: query.sjrMin }),
                    ...(query.sjrMax !== undefined && { lte: query.sjrMax }),
                };
            }

            if (query.citeScoreMin !== undefined || query.citeScoreMax !== undefined) {
                metricFilters.citescore = {
                    ...(query.citeScoreMin !== undefined && { gte: query.citeScoreMin }),
                    ...(query.citeScoreMax !== undefined && { lte: query.citeScoreMax }),
                };
            }

            if (Object.keys(metricFilters).length) {
                where.yearlyMetrics = { some: metricFilters };
            }

            // 1f. Editorial Speed (Convert UI Weeks -> DB Days)
            const speedFilters: Prisma.PublicationEditorialStatWhereInput = {};

            if (query.firstDecisionWeeksMin !== undefined || query.firstDecisionWeeksMax !== undefined) {
                speedFilters.submissionToFirstDecision = {
                    ...(query.firstDecisionWeeksMin !== undefined && { gte: query.firstDecisionWeeksMin * 7 }),
                    ...(query.firstDecisionWeeksMax !== undefined && { lte: query.firstDecisionWeeksMax * 7 }),
                };
            }

            if (query.submissionToAcceptanceWeeksMin !== undefined || query.submissionToAcceptanceWeeksMax !== undefined) {
                speedFilters.submissionToAcceptance = {
                    ...(query.submissionToAcceptanceWeeksMin !== undefined && { gte: query.submissionToAcceptanceWeeksMin * 7 }),
                    ...(query.submissionToAcceptanceWeeksMax !== undefined && { lte: query.submissionToAcceptanceWeeksMax * 7 }),
                };
            }

            if (Object.keys(speedFilters).length) {
                where.editorialStats = { some: speedFilters };
            }

            // 2. Optional full-text search against the search_vector column
            if (query.q && query.q.trim()) {
                const matched = await db.$queryRaw<{ id: number }[]>(Prisma.sql`
                    SELECT id
                    FROM "academicPublications"
                    WHERE "search_vector" @@ plainto_tsquery('english', ${query.q})
                `);
                const ids = matched.map((row) => row.id);
                where.id = ids.length ? { in: ids } : { in: [] };
            }

            // 3. Execute paginated query + total count in parallel
            const [total, publications] = await Promise.all([
                db.academicPublication.count({ where }),
                db.academicPublication.findMany({
                    where,
                    skip: pagination.offset,
                    take: pagination.limit,
                    orderBy: { [pagination.sortBy]: pagination.sortOrder },
                    include: {
                        yearlyMetrics: {
                            take: 1,
                            orderBy: { metricYear: "desc" },
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

            return buildPaginatedResponse(publications, total, pagination.page, pagination.limit);
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
                // console.log("publications:", allPublication);
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