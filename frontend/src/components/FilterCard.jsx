import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setActiveFilters } from '@/redux/jobSlice'
import { filterData } from '@/utils/filterConstants'
import { X, Search } from 'lucide-react'

const FilterCard = () => {
    const dispatch = useDispatch();

    const [selected, setSelected] = useState({
        location: [],
        industry: [],
        jobType: [],
        experience: [],
        salary: []
    });

    const [searchTerms, setSearchTerms] = useState({
        location: '',
        industry: ''
    });

    // Normalize job type so different casing/spacing/hyphen
    // does not cause filtering problems.
    const normalizeJobType = (value) => {
        return value
            ?.toString()
            .toLowerCase()
            .replace(/[-_\s]/g, '')
            .trim();
    };

    const toggleValue = (key, value) => {
        setSelected((prev) => {
            const current = prev[key] || [];

            // For jobType, compare normalized values
            const exists =
                key === 'jobType'
                    ? current.some(
                          (item) =>
                              normalizeJobType(item) ===
                              normalizeJobType(value)
                      )
                    : current.includes(value);

            const updated = exists
                ? current.filter((item) =>
                      key === 'jobType'
                          ? normalizeJobType(item) !==
                            normalizeJobType(value)
                          : item !== value
                  )
                : [...current, value];

            return {
                ...prev,
                [key]: updated
            };
        });
    };

    const clearAll = () => {
        setSelected({
            location: [],
            industry: [],
            jobType: [],
            experience: [],
            salary: []
        });
    };

    const totalSelected = Object.values(selected)
        .flat()
        .length;

    useEffect(() => {
        /*
         * Keep all filters unchanged.
         *
         * Job type values are normalized before sending them
         * to Redux. Therefore:
         *
         * Full-time -> fulltime
         * Full Time -> fulltime
         * full-time -> fulltime
         * FULL TIME -> fulltime
         *
         * Part-time -> parttime
         * Part Time -> parttime
         */
        const normalizedFilters = {
            ...selected,
            jobType: selected.jobType.map((type) =>
                normalizeJobType(type)
            )
        };

        dispatch(setActiveFilters(normalizedFilters));
    }, [selected, dispatch]);

    return (
        <div className='w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700 sticky top-20'>

            {/* Header */}
            <div className='flex items-center justify-between'>
                <h1 className='font-extrabold text-lg dark:text-white'>
                    Filter Jobs
                </h1>

                {totalSelected > 0 && (
                    <button
                        onClick={clearAll}
                        className='flex items-center gap-1 text-xs font-bold text-[#6A38C2] hover:text-[#F83002] transition-colors'
                    >
                        <X className='h-3 w-3' />
                        Clear All ({totalSelected})
                    </button>
                )}
            </div>

            <hr className='my-3 dark:border-gray-700' />

            <div className='flex flex-col gap-5'>

                {filterData.map((section) => {

                    const isSearchable =
                        section.key === 'location' ||
                        section.key === 'industry';

                    const searchTerm =
                        searchTerms[section.key] || '';

                    const visibleOptions =
                        section.options.filter((option) => {
                            const value =
                                typeof option === 'string'
                                    ? option
                                    : option.label;

                            return value
                                .toLowerCase()
                                .includes(
                                    searchTerm.toLowerCase()
                                );
                        });

                    return (
                        <div key={section.filterType}>

                            {/* Section heading */}
                            <h2 className='font-bold text-sm text-gray-800 dark:text-gray-200 mb-2'>
                                {section.filterType}
                            </h2>

                            {/* Search */}
                            {isSearchable && (
                                <div className='relative mb-2'>

                                    <Search className='absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400' />

                                    <input
                                        type='text'
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerms(
                                                (prev) => ({
                                                    ...prev,
                                                    [section.key]:
                                                        e.target.value
                                                })
                                            )
                                        }
                                        placeholder={`Search ${section.filterType.toLowerCase()}...`}
                                        className='w-full pl-8 pr-2 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#6A38C2]'
                                    />

                                </div>
                            )}

                            {/* Options */}
                            <div className='flex flex-col gap-2 max-h-40 overflow-y-auto pr-1'>

                                {visibleOptions.length === 0 ? (
                                    <p className='text-xs text-gray-400 italic'>
                                        No matches
                                    </p>
                                ) : (
                                    visibleOptions.map((option) => {

                                        const value =
                                            typeof option === 'string'
                                                ? option
                                                : option.label;

                                        /*
                                         * Check selected value.
                                         * Job types are compared after normalization.
                                         */
                                        const isChecked =
                                            section.key === 'jobType'
                                                ? (
                                                      selected[
                                                          section.key
                                                      ] || []
                                                  ).some(
                                                      (item) =>
                                                          normalizeJobType(
                                                              item
                                                          ) ===
                                                          normalizeJobType(
                                                              value
                                                          )
                                                  )
                                                : (
                                                      selected[
                                                          section.key
                                                      ] || []
                                                  ).includes(value);

                                        const inputId = `${section.key}-${value}`;

                                        return (
                                            <label
                                                key={inputId}
                                                htmlFor={inputId}
                                                className='flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                            >

                                                <input
                                                    type='checkbox'
                                                    id={inputId}
                                                    checked={isChecked}
                                                    onChange={() =>
                                                        toggleValue(
                                                            section.key,
                                                            value
                                                        )
                                                    }
                                                    className='h-4 w-4 rounded accent-[#6A38C2] cursor-pointer'
                                                />

                                                {value}

                                            </label>
                                        );
                                    })
                                )}

                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default FilterCard;